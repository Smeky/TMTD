import * as pixi from "pixi.js"
import Graphics from "./graphics"
import Grid from "./structures/grid"

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
    }

    setupEventListeners() {
        document.body.addEventListener("keydown", event => {
            // Don't trigger while holding a key down
            if (event.repeat) return

            if (event.key.toLowerCase() === "b") {
                this.grid.toggleDisplayGrid()
            }
        })
    }
    
    run() {
        this.ticker.start()
    }

    update = (delta) => {
        this.graphics.app.renderer.render(this.graphics.app.stage)
        requestAnimationFrame(this.update)
    }
}

export default Game