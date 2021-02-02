import { EntityHandler } from "./handler"
import { Vec2 } from "game/core/structs"

export class MovementHandler extends EntityHandler {
    constructor() {
        super("movement")
    }

    createComponent(opts = {}) {
        return {
            speed: opts.speed || 0,
            destinations: opts.destinations ? [...opts.destinations] : [],
        }
    }

    update(entities, delta) {
        for (const entity of entities) {
            const {movement, transform} = entity.components

            if (movement.destinations.length === 0) {
                continue
            }

            if (transform.pos.distance(movement.destinations[0]) < movement.speed * delta) {
                // Todo: ensure this can't happen please
                // Copy vec since we don't want to mutate the destinations vectors
                transform.pos = new Vec2(movement.destinations.shift())

                if (movement.destinations.length === 0) {
                    entity.emit("destReached")
                }
            }
            else {
                const angle = transform.pos.angle(movement.destinations[0])

                transform.pos.x += Math.cos(angle) * movement.speed * delta
                transform.pos.y += Math.sin(angle) * movement.speed * delta
            }
        }
    }
}
