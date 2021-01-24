import * as pixi from "pixi.js"
import Graphics from "game/graphics"
import SceneHandler, {LevelScene} from "game/scenes"

class Game {
    constructor() {}

    init() {
        this.graphics = new Graphics()
        this.ticker = pixi.Ticker.shared
        this.ticker.autoStart = false
        this.ticker.add(this.update)

        // Todo: Create some sort of event handler, this should be moved there.
        this.setupEventListeners()

        this.sceneHandler = new SceneHandler()
        this.sceneHandler.setScene(LevelScene)

        // Set of debug features, probably should be here
        this.debug = {

        }
    }

    setupEventListeners() {
        
    }
    
    run() {
        this.ticker.start()
    }

    update = (delta) => {

    }
}

export default Game