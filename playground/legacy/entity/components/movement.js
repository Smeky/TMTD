import { Vec2 } from "game/graphics"
import { Component } from "."

export default class MovementComponent extends Component {
    static ComponentName = "Movement"
    static Dependencies = { 
        required: ["Transform"],
        optional: ["Stats", "Display"]
    }

    /**
     * 
     * @param {Entity} entity 
     * @param {object} options 
     */
    constructor(entity, options) {
        super(entity)

        this.useStatsComponent = options.useStatsComponent || null
        this.enableFacingDirection = !!options.enableFacingDirection

        this.speed = options.speed || 0
        this.angle = options.angle || 0
        this.onFinished = options.onFinished || null

        this.velocity = new Vec2()

        this.movedDistance = 0
        this.maxDistance = options.maxDistance || Infinity

        this.updateVelocity()
    }

    setup() {
        if (this.enableFacingDirection) {
            this.dependencies.Display.setRotation(this.angle)
        }
    }

    update(delta) {
        const { Transform: cmpTransform, Stats: cmpStats } = this.dependencies

        if (this.useStatsComponent) {
            this.speed = cmpStats.current[this.useStatsComponent.speed]
        }

        let finished = false
        let deltaSpeed = this.speed * delta

        if (this.movedDistance + deltaSpeed >= this.maxDistance) {
            const diff = this.maxDistance - this.movedDistance

            cmpTransform.position.x += this.velocity.x * (delta * diff / this.movedDistance)
            cmpTransform.position.y += this.velocity.y * (delta * diff / this.movedDistance)

            deltaSpeed = this.maxDistance - this.movedDistance
            finished = true
        }
        else {
            cmpTransform.position.x += this.velocity.x * delta
            cmpTransform.position.y += this.velocity.y * delta
        }

        this.movedDistance += deltaSpeed

        if (finished && this.onFinished) {
            this.onFinished(this.entity)
        }
    }

    setTargetPosition(pos) {
        const { Transform: cmpTransform, Display: cmpDisplay } = this.dependencies

        this.maxDistance = this.movedDistance + cmpTransform.position.distance(pos)
        this.angle = cmpTransform.position.angle(pos)
        
        if (this.enableFacingDirection) {
            cmpDisplay.setRotation(this.angle)
        }

        this.updateVelocity()
    }
    
    updateVelocity() {
        this.velocity.x = Math.cos(this.angle) * this.speed
        this.velocity.y = Math.sin(this.angle) * this.speed
    }

    moveTowardsAngle(speed, angle) {
        this.dependencies.Transform.position.x += Math.cos(angle) * speed
        this.dependencies.Transform.position.y += Math.sin(angle) * speed
    }
}
