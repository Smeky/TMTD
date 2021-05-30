import { AdvancedBloomFilter } from "pixi-filters"
import { BLEND_MODES, Sprite } from "pixi.js"
import { Cooldown } from "game/core"
import { Component } from "."

export class TowerAction extends Component {
    static ComponentName = "TowerAction"
    static Dependencies = { 
        required: ["Transform", "Tower", "Stats"] 
    }

    constructor(entity, options) {
        super(entity)

        this.target = null
        this.parent = options.parent || this.entity
        this.actionType = options.actionType
        this.handler = options.handler

        if (!this.handler) {
            throw new Error("TowerAction - Missing required param 'handler'")
        }
    }

    set range(v) {}
    get range() { return this.dependencies.Stats.current.range }

    set attackRate(v) {}
    get attackRate() { return this.dependencies.Stats.current.attackRate }

    set damage(v) {}
    get damage() { return this.dependencies.Stats.current.damage }

    setup() {
        this.cooldown = new Cooldown(this.attackRate)
    }

    close() {
        this.clearTarget()
    }

    update(delta) {
        if (this.cooldown.update(delta)) {
            this.cooldown.reset()

            if (this.target) {
                this.trigger()
            }
        }

        if (!this.target) {
            this.findTarget()
        }
        else {
            const distance = this.dependencies.Transform.position.distance(this.target.getComponent("Transform").position)

            if(distance > this.range) {
                this.clearTarget()
            }
            else {
                this.dependencies.Tower.setHeadRotation(this.getAngleToTarget())
            }
        }
    }

    trigger() {
        this.handler(this.actionType, this.entity, this.target)
    }

    findTarget() {
        const entities = this.entity.entitySystem.getEntitiesInRadius(this.dependencies.Transform.position, this.range, "enemy")
        const closest = entities.reduce((winner, entity) => {
            const distance = this.dependencies.Transform.position.distance(entity.getComponent("Transform").position)

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

    getTarget() {
        return this.target
    }

    getAngleToTarget() {
        if (!this.target) {
            return 0
        }

        const targetPos = this.target.getComponent("Transform").position
        const center = this.dependencies.Transform.position.add(this.dependencies.Tower.size.divide(2))

        return center.angle(targetPos)
    }

    onTargetFound() {}
    onTargetCleared() {}
}

export class TowerBeamAttack extends TowerAction {
    static ComponentName = "TowerBeamAttack"

    setup() {
        super.setup()

        // Todo:shader: When we get our filters running, this can be replaced
        //              (there's a bug with this, the first laser places has incorrect pivot.x)
        this.sprite = new Sprite(game.assets.BeamBase)
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

        this.parent.addChild(this.sprite)
    }

    close() {
        super.close()

        this.parent.removeChild(this.sprite)
    }

    update(delta) {
        super.update(delta)

        if (this.target) {
            this.updateSprite()
        }
    }

    updateSprite() {
        const fromPos = this.dependencies.Tower.getHeadEndPosition()
        const targetPos = this.target.getComponent("Transform").position

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

export class TowerBulletAttack extends TowerAction {
    static ComponentName = "TowerBulletAttack"

    setup() {
        super.setup()
    }

    close() {
        super.close()
    }
}
