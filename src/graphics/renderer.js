import { Renderer } from "pixi.js"
import { Vec2 } from "."

export default class _Renderer extends Renderer {
    constructor() {
        const containerEl = document.getElementById("canvas_container")
        // const { width, height } = containerEl.getBoundingClientRect()

        super({ 
            width: 1024, // width, 
            height: 768, // height,
            backgroundColor: 0x0e0f12,
            antialias: true,
        })

        containerEl.append(this.view)
    }

    set width(v) { throw "Can't set width this way" }
    get width() { return this.view.width }

    set height(v) { throw "Can't set height this way" }
    get height() { return this.view.height }

    getWindowPosition() {
        const canvas = document.getElementById("canvas_container").getElementsByTagName("canvas")[0]
        const { x, y } = canvas.getBoundingClientRect()

        return new Vec2(x, y)
    }
}
