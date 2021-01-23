
/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {object} bounds 
 * @param {number} bounds.x
 * @param {number} bounds.y
 * @param {number} bounds.w
 * @param {number} bounds.h
 */
// Todo: Replace x & y by pos, bounds by rect
export function clampPosInBounds(x, y, bounds = {x: 0, y: 0, w: 0, h: 0}) {
    let res = {x, y}

    if (x < bounds.x) res.x = bounds.x
    else if (x > bounds.x + bounds.w) res.x = bounds.x + bounds.w
    
    if (y < bounds.y) res.y = bounds.y
    else if (y > bounds.y + bounds.h) res.y = bounds.y + bounds.h

    return res
}