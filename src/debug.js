import { Container, Graphics, DisplayObject } from "pixi.js"
import { Vec2, Rect } from "game/graphics"

export class DebugDisplay {
    static Type = {
        Point: 0,
        Line: 1,
        Bounds: 2,
    }

    constructor(type, object) {
        this.type = type
        this.object = object
        this.shouldDestroy = false
    }

    // Todo: check if es6 has dynamic alias
    // Just an alias
    get pos() { return this.object }
    set pos(value) { this.object = value }

    // Just an alias
    get from() { return this.object.from }
    set from(value) { this.object.from = value }

    // Just an alias
    get to() { return this.object.to }
    set to(value) { this.object.to = value }

    destroy() {
        this.shouldDestroy = true
    }
}

export class Debug extends Container {
    constructor() {
        super()

        this.pointSize = 8

        this.displays = []
        this.graphics = new Graphics()

        this.addChild(this.graphics)
    }

    update(delta) {
        this.graphics.clear()
        this.graphics.lineStyle(1, 0xff0000)

        for (let i = this.displays.length - 1; i >= 0; i--) {
            const display = this.displays[i]

            if (display.shouldDestroy) {
                this.displays.splice(i, 1)
            }
            else {
                if (display.type === DebugDisplay.Type.Bounds) {
                    const bounds = new Rect(display.object.getBounds())
                    this.graphics.drawRect(...bounds.round().spread())
                }
                else if (display.type === DebugDisplay.Type.Point) {
                    const pos = display.object

                    this.graphics.moveTo(pos.x, pos.y - this.pointSize)
                    this.graphics.lineTo(pos.x, pos.y + this.pointSize)
                    this.graphics.moveTo(pos.x - this.pointSize, pos.y)
                    this.graphics.lineTo(pos.x + this.pointSize, pos.y)
                }
                else if (display.type === DebugDisplay.Type.Line) {
                    const from = display.object.from
                    const to = display.object.to

                    this.graphics.moveTo(from.x, from.y)
                    this.graphics.lineTo(to.x, to.y)
                }
            }
        }

        this.graphics.endFill()
    }

    addDisplay(type, object) {
        const display = new DebugDisplay(type, object)

        this.displays.push(display)
        return display
    }

    /**
     * 
     * @param {Vec2} pos 
     */
    displayPoint(pos) {
        return this.addDisplay(DebugDisplay.Type.Point, new Vec2(pos))
    }

    /**
     * 
     * @param {Vec2} from source position
     * @param {Vec2} to target position
     */
    displayLine(from, to) {
        return this.addDisplay(DebugDisplay.Type.Line, {from, to})
    }

    /**
     * 
     * @param {DisplayObject} displayObject
     */
    displayBounds(displayObject) {
        return this.addDisplay(DebugDisplay.Type.Bounds, displayObject)
    }
}
