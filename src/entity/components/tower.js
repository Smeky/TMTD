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
     * @param {Entity} entity 
     * @param {object} options
     * @param {DisplayObject} options.headDisplay 
     * @param {Vec2}          options.headPos
     * @param {Container}     options.parent
     * @param {Vec2}          options.size
     * @param {number}        options.range
     * @param {object}        options.attack
     * @param {number}        options.attack.damage
     * @param {number}        options.attack.rate
     */
    constructor(entity, options) {
        super(entity) 

        this.size = options.size || 0
        this.range = options.range || 0
        this.parent = options.parent || this.entity
        this.headPos = options.headPos
        this.headDisplay = options.headDisplay
        
        // Todo:shader: When we get our filters running, this can be replaced
        //              (there's a bug with this, the first laser places has incorrect pivot.x)
        this.laser = new Sprite(utils.createRectTexture(new Rect(0, 0, 4, 1), 0xffffff))
        this.laser.tint = 0xff1800
        this.laser.scale.x = 0.5
        this.laser.visible = false
        this.laser.blendMode = BLEND_MODES.ADD

        const bloom = new AdvancedBloomFilter({
            threshold: 0,
            bloomScale: 2,
            brightness: 2,
            blur: 2,
        })

        bloom.padding = 10 // otherwise the filter is cut off at texture edge
        this.laser.filters = [bloom]

        this.parent.addChild(this.headDisplay)
        this.parent.addChild(this.laser)

        this.transform = null
        this.target = null

        this.damage = options.attack.damage
        this.cooldown = new Cooldown(options.attack.rate || 1.0)
        this.cooldown.onTrigger = this.handleAttack
    }

    setup() {
        this.transform = this.entity.getComponent("transform")

        if (!this.transform) {
            throw "Requires Transform component"
        }

        const { width, height } = this.headDisplay.getLocalBounds()

        this.headDisplay.pivot.x = Math.round(width / 2)
        this.headDisplay.pivot.y = Math.round(height / 4)

        this.laser.pivot.x = Math.round(this.laser.width / (2 * this.laser.scale.x))

        this.headDisplay.x = this.transform.pos.x + this.headPos.x
        this.headDisplay.y = this.transform.pos.y + this.headPos.y
    }

    close() {
        this.parent.removeChild(this.headDisplay)
        this.parent.removeChild(this.laser)
    }

    update(delta) {
        if (!this.target) {
            this.findTarget()
        }

        if (this.cooldown.update(delta) && this.target) {
            this.cooldown.reset()

            const health = this.target.getComponent("health")

            if (health.reduce(this.damage)) {
                this.damage *= 1.07
            }
        }

        this.updateHeadDisplay()
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

            this.laser.visible = true
            this.updateHeadDisplay()
        }
    }

    clearTarget = () => {
        this.target = null
        this.laser.visible = false

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
            this.transform.pos.x + this.size / 2,
            this.transform.pos.y + this.size / 2,
        ).angle(targetPos)
        
        this.headDisplay.rotation = angle - Math.PI / 2

        const radius = this.headDisplay.height - this.headDisplay.pivot.y
        const fromPos = new Vec2(
            this.headDisplay.x + Math.cos(angle) * radius,
            this.headDisplay.y + Math.sin(angle) * radius,
        )

        this.laser.x = fromPos.x
        this.laser.y = fromPos.y
        this.laser.height = fromPos.distance(targetPos)
        this.laser.rotation = this.headDisplay.rotation

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
