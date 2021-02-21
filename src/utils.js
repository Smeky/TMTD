import { Vec2, Rect } from "game/graphics"
import * as pixi from "pixi.js"

export default {
    /**
     * Creates a new position that is limited to (does not exceed) the bounds
     * @param {Vec2} pos
     * @param {Rect} bounds
     * @returns {Vec2} bound position
     */
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

    stringColorToHex: function(str) {
        if (str[0] !== "#") {
            str = "#" + str
        }
        // According to docs of parseInt():
        //    - If the string begins with "0x", the radix is 16 (hexadecimal)
        return parseInt(str.replace("#", "0x"))
    },

    /**
     * Convert RGB integers to string representation of color - "ff00ff"
     * @param {number} r Red color as integer
     * @param {number} g Green color as integer
     * @param {number} b Blue color as integer
     * @return {string} String representation of color
     */
    rgbColorToString: function(r, g, b) {
        // Handle default (if some args were not passed)
        [r, g, b] = [r || 0, g || 0, b || 0]

        // Convert each color into a hexa string (00-ff), prepend with 0 if needed
        // and spit out concated string of all three
        // Todo:performance: This could be heavy
        return [r, g, b].reduce((str, numColor) => {
            const strColor = numColor.toString(16)
            return str + (strColor.length < 2 ? "0" + strColor : strColor)
        }, "")
    },

    // Todo: moved those two here for now. Move it somewhere appropriate
    createTextureFromObject(displayObject) {
        const {width, height} = displayObject.getLocalBounds()
        const pixels = game.renderer.extract.pixels(displayObject)

        return pixi.Texture.fromBuffer(pixels, width, height)
    },

    /**
     * Creates a new Sprite instance of rectangular shape
     * @param {Rect} bounds Bounds of the rectangle
     * @param {number} color Hexadecimal color
     * @returns {pixi.Sprite} new PIXI Sprite instance
     */
    createRectTexture(bounds, color) {
        const g = new pixi.Graphics()
        g.beginFill(color)
        g.drawRect(bounds.x, bounds.y, bounds.w, bounds.h)
        g.endFill()

        return this.createTextureFromObject(g)
    },

    checkOppositeSigns(first, second) {
        return (first ^ second) < 0
    },
    
    strToClipboard: function(str) {
        const el = document.createElement("textarea")
        el.value = str
        document.body.appendChild(el)
        el.select()
        document.execCommand("copy")
        document.body.removeChild(el)
    },

    getRangeBetweenNumbers: function(first, second) {
        return Math.abs(first - second)
    },

    round: function(number, decimals = 1) {
        // https://stackoverflow.com/a/11832950
        const scalar = 10 * decimals // is scalar the right name?
        return Math.round((number + Number.EPSILON) * scalar) / scalar
    },

    /**
     * Creates a container of sprites that yield a visual display
     * of the tower.
     * @param {object} tower        Tower data // Todo: give tower data a type and use it here
     * @param {number} [headAngle]  [optional] Angle of the head sprite   
     */
    // Todo: move me, plase!
    createTowerDisplay: function(tower, headAngle = 0) {
        const container = new pixi.Container()
        const baseSprite = new pixi.Sprite(tower.base.texture)
        const headSprite = new pixi.Sprite(tower.head.texture)

        headSprite.position.copyFrom(tower.head.pos.multiply(tower.size))
        headSprite.pivot.copyFrom(tower.head.pivot)
        headSprite.rotation = headAngle

        container.addChild(baseSprite)
        container.addChild(headSprite)

        return container
    }

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