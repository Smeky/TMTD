import { Vec2 } from "game/graphics"
import { intersects } from "game/utils"

export { default as Components } from "./components"
export { default as Systems } from "./systems"
export { default as Entity } from "./entity"
export { default as ECSController } from "./controller"

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

export function getTowerHeadEndPosition(entity) {
    const { transform, tower } = entity.components

    const offset = tower.headSprite.height * (1.0 - tower.headSprite.anchor.y)
    const angle = tower.headSprite.rotation + Math.PI / 2
    
    return new Vec2(
        transform.position.x + tower.headSprite.x + Math.cos(angle) * offset,
        transform.position.y + tower.headSprite.y + Math.sin(angle) * offset,
    )
}