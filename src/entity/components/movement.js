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

        this.useStatsComponent = options.useStatsComponent || false
        this.speed = options.speed || 0
        this.angle = options.angle || 0

        this.maxDistance = options.maxDistance || null
        this.movedDistance = 0

        this.destinations = options.destinations ? [...options.destinations] : []
    }

    setup() {
        this.transform = this.entity.ensureComponent("transform")

        if (this.useStatsComponent) {
            this.stats = this.entity.ensureComponent("stats")
        }
    }

    update(delta) {
        if (this.useStatsComponent) {
            this.speed = this.stats.current.movementSpeed
        }

        const deltaSpeed = this.speed * delta

        if (this.destinations.length === 0) {
            this.moveTowardsAngle(deltaSpeed, this.angle)

            if (this.maxDistance) {
                this.movedDistance += deltaSpeed

                if (this.movedDistance >= this.maxDistance) {
                    this.entity.emit("entity_movement_finished")
                }
            }
        }
        else {
            if (this.transform.pos.distance(this.destinations[0]) < deltaSpeed) {
                // Todo: ensure this can't happen please
                // Copy vec since we don't want to mutate the destinations vectors
                this.transform.pos = new Vec2(this.destinations.shift())
    
                if (this.destinations.length === 0) {
                    this.entity.emit("entity_movement_finished")
                }
            }
            else {
                const angle = this.transform.pos.angle(this.destinations[0])
                this.moveTowardsAngle(deltaSpeed, angle)
            }
        }
    }

    moveTowardsAngle(speed, angle) {
        this.transform.pos.x += Math.cos(angle) * speed
        this.transform.pos.y += Math.sin(angle) * speed
    }
}
