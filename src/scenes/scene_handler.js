import { Container } from "pixi.js"
import Scenes from "game/scenes"

export default class SceneHandler extends Container {
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
                  .then((loadData) => {
                        this.scene.setup(loadData)
                        this.scene.started = true
                  })
    }

    update(delta) {
        if (this.scene) {
            this.scene.update(delta)
        }
    }
}
