import { Container } from "pixi.js"

export default class Scene extends Container {
    constructor(id) {
        super()
        this.id = id
    }

    update(delta) {}
    close() {}
}
