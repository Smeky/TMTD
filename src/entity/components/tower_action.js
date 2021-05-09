import utils from "game/utils"
import { Rect, Vec2 } from "game/graphics"
import { AdvancedBloomFilter } from "pixi-filters"
import { BLEND_MODES, Sprite } from "pixi.js"
import { Cooldown } from "game/core"
import { Component } from "."

export class ITowerAttack extends Component {
    constructor(entity, options) {
        super(entity)
    }

    set range(v) {}
    get range() { return this.stats.current.range }

    set attackRate(v) {}
    get attackRate() { return this.stats.current.attackRate }

    set damage(v) {}
    get damage() { return this.stats.current.damage }

    setup() {
        this.transform = this.entity.ensureComponent("transform")
        this.tower = this.entity.ensureComponent("tower")
        this.stats = this.entity.ensureComponent("stats")

        this.cooldown = new Cooldown(this.attackRate)
    }

    close() {
        this.clearTarget()
    }

    update(delta) {
        if (this.cooldown.update(delta)) {
            this.cooldown.reset()
            this.trigger()
        }

        if (!this.target) {
            this.findTarget()
        }
        else {
            const distance = this.transform.pos.distance(this.target.getComponent("transform").pos)

            if(distance > this.range) {
                this.clearTarget()
            }
            else {
                this.tower.setHeadRotation(this.getAngleToTarget())
            }
        }
    }

    findTarget() {
        const entities = this.entity.entities.getEntitiesInRadius(this.transform.pos, this.range, "enemy")
        const closest = entities.reduce((winner, entity) => {
            const distance = this.transform.pos.distance(entity.getComponent("transform").pos)

            if (!winner.entity) {
                winner.entity = entity
                winner.distance = distance
            }
            else {
                if (distance < winner.distance) {
                    winner.entity = entity
                    winner.distance = distance
                }
            }

            return winner
        }, { entity: null, distance: null })

        if (closest.entity) {
            this.target = closest.entity
            this.target.on("close", this.clearTarget)

            this.onTargetFound()
        }

    }

    clearTarget = () => {
        if (this.target) {
            this.target.removeListener("close", this.clearTarget)
            this.target = null

            this.onTargetCleared()
        }
    }

    getAngleToTarget() {
        if (!this.target) {
            return 0
        }

        const targetPos = this.target.getComponent("transform").pos
        const center = this.transform.pos.add(this.tower.size.divide(2))

        return center.angle(targetPos)
    }

    onTargetFound() {}
    onTargetCleared() {}
}

export class TowerLaserAttack extends ITowerAttack {
    setup() {
        super.setup()

        // Todo:shader: When we get our filters running, this can be replaced
        //              (there's a bug with this, the first laser places has incorrect pivot.x)
        this.sprite = new Sprite(utils.createRectTexture(new Rect(0, 0, 4, 1), 0xffffff))
        this.sprite.scale.x = 0.5
        this.sprite.pivot.x = Math.round(this.sprite.width / (2 * this.sprite.scale.x))
        this.sprite.tint = 0xff1800
        this.sprite.visible = false
        this.sprite.blendMode = BLEND_MODES.ADD

        const bloom = new AdvancedBloomFilter({
            threshold: 0,
            bloomScale: 2,
            brightness: 2,
            blur: 2,
        })

        bloom.padding = 10 // otherwise the filter is cut off at texture edge
        this.sprite.filters = [bloom]

        game.camera.addChild(this.sprite, 20)
    }

    close() {
        super.close()

        game.camera.removeChild(this.sprite)
    }

    trigger() {
        if (this.target) {
            game.emit("deal_damage", { 
                target: this.target, 
                source: this.entity, 
                amount: this.damage 
            })
        }
    }

    update(delta) {
        super.update(delta)

        if (this.target) {
            this.updateSprite()
        }
    }

    updateSprite() {
        const fromPos = this.tower.getHeadEndPosition()
        const targetPos = this.target.getComponent("transform").pos

        this.sprite.position.copyFrom(fromPos)
        this.sprite.height = fromPos.distance(targetPos)
        this.sprite.rotation = fromPos.angle(targetPos) - Math.PI / 2
    }

    onTargetFound() {
        this.sprite.visible = true

    }

    onTargetCleared() {
        this.sprite.visible = false
    }
}


export class TowerBulletAttack extends ITowerAttack {
    setup() {
        super.setup()

        this.bulletTexture = utils.createRectTexture(new Rect(0, 0, 6, 2), 0xffffff)
    }

    close() {
        super.close()
    }

    trigger() {
        if (this.target) {
            game.emit("create_bullet", { 
                texture: this.bulletTexture,
                source: this.entity,
                pos: this.tower.getHeadEndPosition(),
                direction: this.tower.getHeadRotation(),
                velocity: 500,
                range: this.range
            })
        }
    }
}