import { Renderer } from "pixi.js"

export default class _Renderer extends Renderer {
    constructor() {
        const containerEl = document.getElementById("canvas_container")
        const { width, height } = containerEl.getBoundingClientRect()

        super({ 
            width: width, 
            height: height,
            backgroundColor: 0x1c2433,
            antialias: true,
        })

        containerEl.append(this.view)
    }
}
