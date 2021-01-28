import Scene from "game/scenes/scene"

export default class LevelScene extends Scene {
    constructor() {
        super("level")

        this.eventProxy = game.events.getProxy()
    }
    
    close() {
        this.eventProxy.close()
    }

    update(delta) {

    }
}