import { Container } from "pixi.js"

export default class Scene {
    constructor(id) {
        this.id = id
        this.sceneContainer = new Container()
    }

    update(delta) {}
    close() {}
}