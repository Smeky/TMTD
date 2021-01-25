import * as pixi from "pixi.js"
import Graphics from "game/graphics"
import SceneHandler, {LevelScene, EditorScene} from "game/scenes"
import EventHandler from "game/core/events"

class Game {
    constructor() {}

    init() {
        this.graphics = new Graphics()
        this.ticker = pixi.Ticker.shared
        this.ticker.autoStart = false
        this.ticker.add(this.update)

        this.events = new EventHandler()

        // Set of debug features, probably should be here
        this.debug = {

        }

        // Scene init should be last
        this.sceneHandler = new SceneHandler()
        this.sceneHandler.setScene(EditorScene)
    }
    
    run() {
        this.ticker.start()
    }

    update = (delta) => {
        // this.graphics.renderer.render(this.graphics.app.stage)
    }
}

export default Game