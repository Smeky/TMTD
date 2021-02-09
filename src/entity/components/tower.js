import { Vec2 } from "game/core/structs"
import { Component } from "."

export default class TowerComponent extends Component {
    static __Name = "tower"

    /**
     * 
     * @param {Entity} entity 
     * @param {object} options 
     */
    constructor(entity, options) {
        super(entity) 

        this.size = options.size || 0
        this.range = options.range || 0
        this.headPos = options.headPos
        this.headDisplay = options.headDisplay
        this.entity.addChild(this.headDisplay)

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
            this.target.on("close", () => this.target = null)

            this.updateHeadDisplay()
        }
    }

    updateHeadDisplay() {
        if (!this.target) {
            return
        }

        const otherPos = this.target.getComponent("transform").pos
        const angle = this.transform.pos.add(new Vec2(this.size)).angle(otherPos)
        this.headDisplay.rotation = angle - Math.PI / 2
    }
}
