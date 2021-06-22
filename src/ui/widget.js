import { Container } from "pixi.js";

export default class Widget extends Container {
    constructor() {
        super()

        this.interactive = true
    }

    handleWindowResized(oldSize, newSize) {
        for (const child of this.children) {
            if (child instanceof Widget) {
                child.handleWindowResized(oldSize, newSize)
            }
        }

        this.x = (this.x / oldSize.x) * newSize.x
        this.y = (this.y / oldSize.y) * newSize.y
    }
}
