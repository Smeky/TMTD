import Scene from "game/scenes/scene"

export default class LevelScene extends Scene {
    constructor() {
        super("level")

        game.ticker.add(this.update)

        console.log("LevelScene is set up")
    }

    close() {

    }

    update = (delta) => {

    }
}