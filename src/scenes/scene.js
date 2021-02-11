import { Container } from "pixi.js"

export default class Scene extends Container {
    static __Name = null

    constructor() {
        super()
        this.name = this.constructor.__Name
    }

    update(delta) {}
    close() {}
}
