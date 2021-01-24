import Scene from "game/scenes/scene"
import Grid from "game/core/grid"

export default class LevelScene extends Scene {
    constructor() {
        super("level")

        game.ticker.add(this.update)

        this.grid = new Grid()
        
        this.eventProxy = game.events.getProxy()
        this.eventProxy.listen("keyup", this.onKeyUp)
        
        console.log("LevelScene is set up")
    }
    
    close() {
        this.eventProxy.close()
    }

    update = (delta) => {

    }

    onKeyUp = (event) => {
        if (event.key.toLowerCase() === "b") {
            this.grid.toggleDisplayGrid()
        }
    }
}