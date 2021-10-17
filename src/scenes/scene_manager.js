import { Modules, createModulesStore } from "./modules"
import Scenes from "game/scenes"
import { Container } from "pixi.js"
import { Scene } from "."
import { Game } from ".."

export default class SceneManager extends Container {
    constructor() {
        super()
        this.scene = null
    }

    setScene(name) {
        if (!Scenes.hasOwnProperty(name)) {
            throw new Error(`Unable to set scene - Unknown scene name "${name}"`)
        }

        if (this.scene) {
            this.closeScene(this.scene)
            this.removeChild(this.scene)
        }

        this.scene = this.createScene(name, Scenes[name])
        this.scene.started = true

        Game.emit("scene_changed", name)
    }

    createScene(sceneName, sceneData) {
        const modules = sceneData.modules.map(name => Modules[name])
                                         .filter((module, index) => { 
                                            if (!module) {
                                                console.error(new Error(`Scene has nonexistent module "${sceneData.modules[index]}". Maybe check scene definition..`))
                                                return false
                                            }

                                            return true
                                          })
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
