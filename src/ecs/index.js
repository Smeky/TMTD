import { Vec2 } from "game/graphics"
import { intersects } from "game/utils"

export { default as Components } from "./components"
export { default as Systems } from "./systems"
export { default as Entity } from "./entity"
export { default as ECSController } from "./ecs_controller"

/**
 * 
 * @param {string|string[]} tags 
 */
export function filterEntitiesByTags(tags) {
    tags = Array.isArray(tags) ? [...tags] : [tags]

    return (entity) => intersects(entity.tags, tags)
}

export function filterEntitiesByComponent(name) {
    return (entity) => entity.hasComponent(name)
}

export function filterOutEntityById(id) {
    return (entity) => entity.id !== id
}

export function isEntityInRadius(entity, position, radius) {
    return position.distance(entity.components.transform.position) <= radius
}
