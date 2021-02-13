import { Vec2 } from "game/graphics"
import { Shaders } from "game/graphics/shaders"
import { DisplayObject } from "pixi.js"
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
     */
    constructor(entity, options) {
        super(entity) 

        this.size = options.size || 0
        this.range = options.range || 0
        this.parent = options.parent || this.entity
        this.headPos = options.headPos
        this.headDisplay = options.headDisplay
        
        this.laserShader = new Shaders()
        this.parent.addChild(this.headDisplay)
        this.parent.addChild(this.laserShader)

        this.transform = null
        this.target = null
    }

    setup() {
        this.transform = this.entity.getComponent("transform")

        if (!this.transform) {
            throw "Requires Transform component"
        }

        const { width, height } = this.headDisplay.getLocalBounds()

        this.headDisplay.pivot.x = Math.round(width / 2)
        this.headDisplay.pivot.y = Math.round(height / 4)

        this.headDisplay.x = this.transform.pos.x + this.headPos.x
        this.headDisplay.y = this.transform.pos.y + this.headPos.y
    }

    close() {
        this.parent.removeChild(this.headDisplay)
        this.parent.removeChild(this.laserShader)
    }

    update(delta) {
        if (!this.target) {
            this.findTarget()
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

            this.updateHeadDisplay()
        }
    }

    clearTarget = () => {
        this.target = null

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
        
        this.laserShader.laser(fromPos, targetPos)

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
