import { Vec2 } from "game/graphics"
import { ECSSystem } from "."

export default class PhysicsSystem extends ECSSystem {
    static Dependencies = ["transform", "velocity"]

    updateEntity(delta, entity, entities) {
        const { transform, velocity, travelLimit } = entity.components

        const prevPos = new Vec2(transform.position)

        transform.position.x += velocity.x * delta
        transform.position.y += velocity.y * delta

        if (travelLimit) {
            travelLimit.traveledDistance += prevPos.distance(transform.position)

            if (travelLimit.traveledDistance >= travelLimit.maxDistance) {
                travelLimit.onLimitReached(entity)
            }
        }
    }
}
