import { Container } from "pixi.js"

export default class SceneHandler extends Container {
    constructor() {
        super()
        this.scene = null
    }

    setScene(Scene) {
        if (this.scene) {
            this.scene.close()
            this.removeChild(this.scene)
        }

        this.scene = new Scene()
        this.addChild(this.scene)
    }

    update(delta) {
        if (this.scene) {
            this.scene.update(delta)
        }
    }
}
