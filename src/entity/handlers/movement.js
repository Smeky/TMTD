import { EntityHandler } from "./handler"

export class MovementHandler extends EntityHandler {
    static HandlerName = "movement"

    static createComponent() {
        return {
            speed: 0,
            destinations: [],
        }
    }

    update(entities, delta) {
        for (const entity of entities) {
            const movement = entity.components.movement
            const property = entity.components.property

            if (movement.destinations.length === 0) {
                continue
            }

            if (property.pos.distance(movement.destinations[0]) < movement.speed * delta) {
                property.pos = movement.destinations.shift()
            }
            else {
                const angle = property.pos.angle(movement.destinations[0])

                property.pos.x += Math.cos(angle) * movement.speed * delta
                property.pos.y += Math.sin(angle) * movement.speed * delta
            }
        }
    }
}
