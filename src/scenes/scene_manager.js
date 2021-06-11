import { Container } from "pixi.js"
import Scenes from "game/scenes"

export default class SceneManager extends Container {
    constructor() {
        super()
        this.scene = null
    }

    setScene(name) {
        if (this.scene) {
            this.closeScene(this.scene)
            this.removeChild(this.scene)
        }

        this.scene = new Scenes[name]()
        this.addChild(this.scene)

        this.scene.load()
                  .then(() => {
                        this.setupScene(this.scene)
                        game.emit("scene_changed", name)
                        
                        this.scene.started = true
                  })
    }

    setupScene(scene) {
        for (const module of scene.moduleList) {
            module.setup()
        }
    }

    closeScene(scene) {
        for (const module of scene.moduleList) {
            module.close()
        }
    }

    update(delta) {
        if (this.scene && this.scene.started) {
            for (const module of this.scene.moduleList) {
                module.update(delta)
            }
        }
    }
}
