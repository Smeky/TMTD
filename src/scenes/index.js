export { default as LevelScene } from "game/scenes/level"
export { default as EditorScene } from "game/scenes/editor" // Todo: Ensure this exists inly in dev mode 

export default class SceneHandler {
    constructor() {
        this.scene = null
    }

    setScene(Scene) {
        if (this.scene) {
            this.scene.close()
            game.graphics.stage.removeChild(this.scene.sceneContainer)
        }

        this.scene = new Scene()
        game.graphics.stage.addChild(this.scene.sceneContainer)
    }
}
