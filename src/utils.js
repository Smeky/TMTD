import { Vec2, Rect } from "game/core/structs"

export default {
    /**
     * Creates a new positions that is limited to bounds
     * @param {Vec2} pos
     * @param {Rect} bounds
     * @returns {Vec2} bound position
     */
    
    // Todo: Replace x & y by pos, bounds by rect
    clampPosInBounds: function(pos, bounds) {
        let res = new Vec2(pos)
    
        if (pos.x < bounds.x) res.x = bounds.x
        else if (pos.x > bounds.x + bounds.w) res.x = bounds.x + bounds.w
        
        if (pos.y < bounds.y) res.y = bounds.y
        else if (pos.y > bounds.y + bounds.h) res.y = bounds.y + bounds.h
    
        return res
    },

    rbgColorToHex: function(str) {
        // According to docs of parseInt():
        //    - If the string begins with "0x", the radix is 16 (hexadecimal)
        return parseInt(str.replace("#", "0x"))
    },
}