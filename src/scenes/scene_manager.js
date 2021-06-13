import { Modules, createModulesStore } from "./modules"
import { SceneData } from "game/data"
import { Container } from "pixi.js"
import { Scene } from "."
import { Game } from ".."

export default class SceneManager extends Container {
    constructor() {
        super()
        this.scene = null
    }

    setScene(name) {
        if (!SceneData.hasOwnProperty(name)) {
            throw new Error(`Unable to set scene - Unknown scene name "${name}"`)
        }

        if (this.scene) {
            this.closeScene(this.scene)
            this.removeChild(this.scene)
        }

        this.scene = this.createScene(name, SceneData[name])
        this.scene.started = true

        Game.emit("scene_changed", name)
    }

    createScene(sceneName, sceneData) {
        const modules = sceneData.modules.map(name => Modules[name])
        const scene = new Scene()
        
        scene.name = sceneName
        scene.modules = createModulesStore(scene, modules)
        
        for (const module of Object.values(scene.modules)) {
            module.setup()
        }

        return scene
    }

    closeScene(scene) {
        for (const module of Object.values(scene.modules)) {
            module.close()
        }

        scene.started = false
    }

    update(delta) {
        if (this.scene && this.scene.started) {
            for (const module of Object.values(this.scene.modules)) {
                module.update(delta)
            }
        }
    }
}
