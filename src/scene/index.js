export { default as Scene} from "./base"
export { default as LevelScene } from "./level"
export { default as EditorScene } from "./editor"
export { default as TomGroundScene} from "./tomground"

export class SceneHandler {
    constructor() {
        this.scene = null
    }

    setScene(Scene) {
        if (this.scene) {
            this.scene.close()
            game.stage.removeChild(this.scene.sceneContainer)
        }

        this.scene = new Scene()
        game.stage.addChild(this.scene.sceneContainer)
    }

    update(delta) {
        if (this.scene) {
            this.scene.update(delta)
        }
    }
}
