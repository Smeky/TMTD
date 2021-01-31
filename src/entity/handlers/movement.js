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
            const transform = entity.components.transform

            if (movement.destinations.length === 0) {
                continue
            }

            if (transform.pos.distance(movement.destinations[0]) < movement.speed * delta) {
                transform.pos = movement.destinations.shift()
            }
            else {
                const angle = transform.pos.angle(movement.destinations[0])

                transform.pos.x += Math.cos(angle) * movement.speed * delta
                transform.pos.y += Math.sin(angle) * movement.speed * delta
            }
        }
    }
}
