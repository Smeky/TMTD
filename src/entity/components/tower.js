import utils from "game/utils"
import { Vec2, Rect } from "game/graphics"
import { Cooldown } from "game/core/cooldown"
import { DisplayObject, Sprite, BLEND_MODES } from "pixi.js"
import { AdvancedBloomFilter } from "pixi-filters"
import { Component } from "."

export default class TowerComponent extends Component {
    static __Name = "tower"

    /**
     * 
     * @param {Entity}        entity 
     * @param {object}        options
     * @param {object}        options.data
     * @param {DisplayObject} [options.parent] Parent for head part of the tower. Usually a layer above entities. Defaults to this.entity
     */
    constructor(entity, options) {
        super(entity) 

        this.data = options.data
        this.parent = options.parent || this.entity

        this.transform = null
        this.target = null

        this.setupHeadDisplay()
        this.setupLaserDisplay()

        {   // Setup damage
            const { rate, damage } = this.data.head.attack

            this.damage = damage
            this.cooldown = new Cooldown(rate || 1.0)
            this.cooldown.onTrigger = this.handleAttack
        }
    }

    setup() {
        const display = this.entity.getComponent("display")
        this.transform = this.entity.getComponent("transform")

        // Todo: We need something.. prettier
        if (!this.transform) {
            throw "Requires Transform component"
        }
        if (!display) {
            throw "Requires Display component"
        }

        
        const { size } = this.data
        const { texture } = this.data.base
        
        display.setDisplayObject(new Sprite(texture))
        
        const posOnTower = this.data.head.pos.multiply(size)
        this.headSprite.x = this.transform.pos.x + posOnTower.x
        this.headSprite.y = this.transform.pos.y + posOnTower.y
        
        this.laserSprite.pivot.x = Math.round(this.laserSprite.width / (2 * this.laserSprite.scale.x))
    }

    setupHeadDisplay() {
        const { texture, pivot } = this.data.head

        this.headSprite = new Sprite(texture)
        this.headSprite.pivot.copyFrom(pivot)
        
        this.parent.addChild(this.headSprite)
    }

    setupLaserDisplay() {
        // Todo:shader: When we get our filters running, this can be replaced
        //              (there's a bug with this, the first laser places has incorrect pivot.x)
        this.laserSprite = new Sprite(utils.createRectTexture(new Rect(0, 0, 4, 1), 0xffffff))
        this.laserSprite.tint = 0xff1800
        this.laserSprite.scale.x = 0.5
        this.laserSprite.visible = false
        this.laserSprite.blendMode = BLEND_MODES.ADD

        const bloom = new AdvancedBloomFilter({
            threshold: 0,
            bloomScale: 2,
            brightness: 2,
            blur: 2,
        })

        bloom.padding = 10 // otherwise the filter is cut off at texture edge
        this.laserSprite.filters = [bloom]

        this.parent.addChild(this.laserSprite)
    }

    close() {
        this.parent.removeChild(this.headSprite)
        this.parent.removeChild(this.laserSprite)
    }

    update(delta) {
        if (!this.target) {
            this.findTarget()
        }

        if (this.cooldown.update(delta) && this.target) {
            this.cooldown.reset()

            const health = this.target.getComponent("health")

            if (health.reduce(this.damage)) {
                this.damage *= 1.075
            }
        }

        this.updateHeadDisplay()
    }

    findTarget() {
        const { range } = this.data.head.attack

        const entities = this.entity.entities.getEntitiesInRadius(this.transform.pos, range, "enemy")
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

            this.laserSprite.visible = true
            this.updateHeadDisplay()
        }
    }

    clearTarget = () => {
        this.target = null
        this.laserSprite.visible = false

        if (this.debug) {
            this.debug.destroy()
        }
    }

    updateHeadDisplay() {
        if (!this.target) {
            return
        }

        const targetPos = this.target.getComponent("transform").pos

        const angle = new Vec2(
            this.transform.pos.x + this.data.size.x / 2,
            this.transform.pos.y + this.data.size.y / 2,
        ).angle(targetPos)
        
        this.headSprite.rotation = angle - Math.PI / 2

        const radius = this.headSprite.height - this.headSprite.pivot.y
        const fromPos = new Vec2(
            this.headSprite.x + Math.cos(angle) * radius,
            this.headSprite.y + Math.sin(angle) * radius,
        )

        this.laserSprite.x = fromPos.x
        this.laserSprite.y = fromPos.y
        this.laserSprite.height = fromPos.distance(targetPos)
        this.laserSprite.rotation = this.headSprite.rotation

        // if (!this.debug) {
        //     this.debug = game.debug.displayLine(new Vec2(), new Vec2())
        // }
        // else {
        //     const myBounds = new Rect(this.entity.getBounds()) // ugly, but no other choice atm
        //     const tarBounds = new Rect(this.target.getBounds())

        //     this.debug.from = myBounds.center()
        //     this.debug.to = tarBounds.center()
        // }
    }
}
