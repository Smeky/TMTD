import { Vec2, Rect } from "game/core/structs"

/**
 * Creates a new positions that is limited to bounds
 * @param {Vec2} pos
 * @param {Rect} bounds
 * @returns {Vec2} bound position
 */

// Todo: Replace x & y by pos, bounds by rect
export function clampPosInBounds(pos, bounds) {
    let res = new Vec2(pos)

    if (pos.x < bounds.x) res.x = bounds.x
    else if (pos.x > bounds.x + bounds.w) res.x = bounds.x + bounds.w
    
    if (pos.y < bounds.y) res.y = bounds.y
    else if (pos.y > bounds.y + bounds.h) res.y = bounds.y + bounds.h

    return res
}