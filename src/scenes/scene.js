import * as pixi from "pixi.js"

// Todo: Move this to scenes/index.js and fix imports/exports
export default class Scene {
    constructor(id) {
        this.id = id
        this.sceneContainer = new pixi.Container()
    }
}
