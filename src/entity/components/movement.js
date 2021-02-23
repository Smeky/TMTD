import { Vec2 } from "game/graphics"
import { Component } from "."

export default class MovementComponent extends Component {
    /**
     * 
     * @param {Entity} entity 
     * @param {object} options 
     * @param {number} [options.speed] [optional] speed in pixels per second
     * @param {Vec2[]} [options.destinations] [optional] array of points along which the component will move
     */
    constructor(entity, options) {
        super(entity) 

        this.transform = null
        this.speed = options.speed || 0
        this.destinations = [...(options.destinations || [])]
    }

    setup() {
        this.transform = this.entity.getComponent("transform")

        if (!this.transform) {
            throw "Requires Transform component"
        }
    }

    update(delta) {
        if (this.destinations.length === 0) {
            return
        }

        if (this.transform.pos.distance(this.destinations[0]) < this.speed * delta) {
            // Todo: ensure this can't happen please
            // Copy vec since we don't want to mutate the destinations vectors
            this.transform.pos = new Vec2(this.destinations.shift())

            if (this.destinations.length === 0) {
                this.entity.emit("destReached")
            }
        }
        else {
            const angle = this.transform.pos.angle(this.destinations[0])

            this.transform.pos.x += Math.cos(angle) * this.speed * delta
            this.transform.pos.y += Math.sin(angle) * this.speed * delta
        }
    }
}
