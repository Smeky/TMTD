import { EntityHandler } from "./handler"
import { Vec2 } from "game/core/structs"

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
                // Todo: ensure this can't happen please
                // Copy vec since we don't want to mutate the destinations vectors
                transform.pos = new Vec2(movement.destinations.shift())
            }
            else {
                const angle = transform.pos.angle(movement.destinations[0])

                transform.pos.x += Math.cos(angle) * movement.speed * delta
                transform.pos.y += Math.sin(angle) * movement.speed * delta
            }
        }
    }
}
