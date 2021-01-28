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

    clampPosToGrid(pos, cellSize) {
        return new Vec2(
            Math.floor((pos.x + cellSize / 2) / cellSize) * cellSize,
            Math.floor((pos.y + cellSize / 2) / cellSize) * cellSize,
        )
    },

    rbgColorToHex: function(str) {
        // According to docs of parseInt():
        //    - If the string begins with "0x", the radix is 16 (hexadecimal)
        return parseInt(str.replace("#", "0x"))
    },

    // Todo: Just an idea:
    // animate: function(opts = {
    //     target,
    //     transform, // compares, finds differences and updates just those
    //     type, // linear, ..
    //     time
    // }) {
    //     ...
    //     // Returns a callback that gets registered in game.ticker
    //     return (delta) => {
    //         target.x += vel.x * delta
    //         ...
    //     }
    // },

    // Todo: Another Idea:
    // Remember that scaling of canvas to window size for editor?
    // What if we did that, just reversed, for boss fights, making them harder.
    // Or just increased difficulty in general. Imagine having hard mobs
    // that if they do something speceial, they reduce your game window size. lol
}