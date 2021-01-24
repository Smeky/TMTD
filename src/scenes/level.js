import Scene from "game/scenes/scene"
import Grid from "game/core/grid"

export default class LevelScene extends Scene {
    constructor() {
        super("level")

        game.ticker.add(this.update)

        console.log("LevelScene is set up")

        // Todo: Move to scene
        this.grid = new Grid()

        document.body.addEventListener("keyup", this.onKeyUp)
    }

    close() {
        document.body.removeEventListener("keyup", this.onKeyUp)
    }

    update = (delta) => {

    }

    onKeyUp = (event) => {
        if (event.key.toLowerCase() === "b") {
            this.grid.toggleDisplayGrid()
        }
    }
}