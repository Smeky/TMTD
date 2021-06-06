import { ECSSystem } from ".";
import { filterEntitiesByComponent,  filterOutEntityById } from "..";

export default class CollisionSystem extends ECSSystem {
    static Dependencies = ["transform", "collideable"]

    updateEntity(delta, entity, entities) {
        const { collideable } = entity.components

        if (collideable.type === "active") {
            const others = entities.filter(filterEntitiesByComponent("collideable"))
                                   .filter(filterOutEntityById(entity.id))

            for (const other of others) {
                const { collideable: otherCollideable } = other.components

                if (otherCollideable.solid && this.checkEntityCollision(entity, other)) {
                    if (collideable.onCollision) {
                        collideable.onCollision(entity, other)
                    }
                }
            }
        }
    }

    checkEntityCollision(first, second) {
        const { transform: firstTransform,  collideable: firstCollideable }  = first.components
        const { transform: secondTransform, collideable: secondCollideable } = second.components

        return firstTransform.position.distance(secondTransform.position) < firstCollideable.radius + secondCollideable.radius
    }
}
