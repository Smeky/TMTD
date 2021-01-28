import Scene from "game/scenes/scene"

export default class LevelScene extends Scene {
    constructor() {
        super("level")

        this.inputProxy = game.input.getProxy()
    }
    
    close() {
        this.inputProxy.close()
    }

    update(delta) {

    }
}