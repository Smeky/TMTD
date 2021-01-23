import * as pixi from "pixi.js"
import Graphics from "game/graphics"
import Grid from "game/core/grid"
import SceneHandler, {LevelScene} from "game/scenes"
import { Vec2 } from "./structs"

class Game {
    constructor() {}

    init() {
        this.graphics = new Graphics()
        this.ticker = pixi.Ticker.shared
        this.ticker.autoStart = false
        this.ticker.add(this.update)

        // Todo: Move to scene
        this.grid = new Grid()

        // Todo: Create some sort of event handler, this should be moved there.
        this.setupEventListeners()

        this.sceneHandler = new SceneHandler()
        this.sceneHandler.setScene(LevelScene)

        // Set of debug features, probably should be here
        this.debug = {

        }
    }

    setupEventListeners() {
        document.body.addEventListener("keyup", event => {
            if (event.key.toLowerCase() === "b") {
                this.grid.toggleDisplayGrid()
            }
        })
    }
    
    run() {
        this.ticker.start()
    }

    update = (delta) => {

    }
}

export default Game