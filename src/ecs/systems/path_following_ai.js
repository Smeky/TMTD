import { Vec2 } from "game/graphics"
import { ECSSystem } from "."

export default class PathFollowingAI extends ECSSystem {
    static Dependencies = ["transform", "velocity", "speed", "path"]

    updateEntity(delta, entity, entities) {
        const { transform, velocity, path, speed } = entity.components

        if (path.points.length) {
            const destination = path.points[0]
            const deltaVel = velocity.multiply(delta)
            const deltaDistance = new Vec2(0, 0).distance(deltaVel)

            if (transform.position.distance(destination) <= deltaDistance) {
                path.points.shift()
                
                if (path.points.length === 0) {
                    velocity.x = 0
                    velocity.y = 0

                    if (path.onFinished) {
                        path.onFinished(entity)
                    }
                }
            }
            else {
                const angle = transform.position.angle(destination)
                velocity.x = Math.cos(angle) * speed
                velocity.y = Math.sin(angle) * speed
            }
        }
    }
}
