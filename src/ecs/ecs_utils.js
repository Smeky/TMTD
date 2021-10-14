import { Vec2 } from "game/graphics"

export function getTowerHeadEndPosition(entity) {
    const { tower, transform } = entity.components
    const { headSprite } = tower
    
    const radius = headSprite.width * (1.0 - headSprite.anchor.x)

    return new Vec2(
        transform.position.x + radius * Math.cos(headSprite.rotation),
        transform.position.y + radius * Math.sin(headSprite.rotation),
    )
}
