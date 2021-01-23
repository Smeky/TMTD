export { default as LevelScene } from "game/scenes/level"

export default class SceneHandler {
    constructor() {
        this.scene = null
    }

    setScene(Scene) {
        if (this.scene) {
            this.scene.close()
        }

        this.scene = new Scene()
    }
}
