import { Container } from "pixi.js"
import Scenes from "game/scenes"

export default class SceneManager extends Container {
    constructor() {
        super()
        this.scene = null
    }

    setScene(name) {
        if (this.scene) {
            this.scene.close()
            this.removeChild(this.scene)
        }

        this.scene = new Scenes[name]()
        this.addChild(this.scene)

        this.scene.load()
                  .then(() => {
                        this.scene.setup()
                        this.scene.started = true
                  })
    }

    update(delta) {
        if (this.scene) {
            this.scene.update(delta)
        }
    }
}
