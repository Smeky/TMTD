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
        this.velocity = new Vec2()

        this.movedDistance = 0
        this.maxDistance = options.maxDistance || Infinity

        this.updateVelocity()
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

        let finished = false
        let deltaSpeed = this.speed * delta

        if (this.movedDistance + deltaSpeed >= this.maxDistance) {
            const diff = this.maxDistance - this.movedDistance

            this.transform.pos.x += this.velocity.x * (delta * diff / this.movedDistance)
            this.transform.pos.y += this.velocity.y * (delta * diff / this.movedDistance)

            deltaSpeed = this.maxDistance - this.movedDistance
            finished = true
        }
        else {
            this.transform.pos.x += this.velocity.x * delta
            this.transform.pos.y += this.velocity.y * delta
        }

        this.movedDistance += deltaSpeed

        if (finished) {
            this.entity.emit("movement.finished")
        }
    }

    setTargetPosition(pos) {
        this.maxDistance = this.movedDistance + this.transform.pos.distance(pos)
        this.angle = this.transform.pos.angle(pos)

        this.updateVelocity()
    }
    
    updateVelocity() {
        this.velocity.x = Math.cos(this.angle) * this.speed
        this.velocity.y = Math.sin(this.angle) * this.speed
    }

    moveTowardsAngle(speed, angle) {
        this.transform.pos.x += Math.cos(angle) * speed
        this.transform.pos.y += Math.sin(angle) * speed
    }
}
