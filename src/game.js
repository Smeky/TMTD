import * as pixi from "pixi.js"
import Debugger from "game/debug"
import SceneHandler, {LevelScene, EditorScene} from "game/scenes"
import InputHandler from "game/core/input"
import { Vec2 } from "./core/structs"

pixi.utils.skipHello()

class Game {
    constructor() {}

    get width() {
        return this.renderer.view.width
    }

    get height() {
        return this.renderer.view.height
    }

    init() {
        const width = window.innerWidth
        const height = window.innerHeight

        this.renderer = new pixi.Renderer({ 
            width: width, 
            height: height,
            backgroundColor: 0x1c2433 
        })

        this.stage = new pixi.Container()
        this.stage.pivot.x = Math.round(-width / 2)
        this.stage.pivot.y = Math.round(-height / 2)

        window.addEventListener("resize", this.handleResize)

        document.body.appendChild(this.renderer.view)

        this.ticker = new pixi.Ticker()
        this.ticker.add(this.update, pixi.UPDATE_PRIORITY.LOW)
        this.ticker.start()

        this.input = new InputHandler()
        this.debug = new Debugger()

        this.setupScene()

        this.stage.addChild(this.debug)

        this.firstUpdate = true
    }

    setupScene() {
        // Scene init should be last
        this.sceneHandler = new SceneHandler()
        this.sceneHandler.setScene(LevelScene)

        // Buttons to switch between scenes 
        {
            const level = new pixi.Container()
            level.position.x = -90
            level.position.y = -window.innerHeight / 2 + 30
            level.interactive = true
            level.on("mouseup", () => this.sceneHandler.setScene(LevelScene))
            level.addChild(new pixi.Text("Level Scene", {fill: "#ffffff"}))
            level.pivot.x = level.getLocalBounds().width / 2
    
            const editor = new pixi.Container()
            editor.position.x = 90
            editor.position.y = -window.innerHeight / 2 + 30
            editor.interactive = true
            editor.on("mouseup", () => this.sceneHandler.setScene(EditorScene))
            editor.addChild(new pixi.Text("Editor Scene", {fill: "#ffffff"}))
            editor.pivot.x = editor.getLocalBounds().width / 2
            
            this.stage.addChild(level)
            this.stage.addChild(editor)
        }
    }
    
    run() {
        this.ticker.start()
        this.counter = 0
    }


    update = (delta) => {
        if (this.firstUpdate) {
            this.firstUpdate = false
            return
        }

        // if (++this.counter > 10) return
        // We don't use delta, since we want option (B)
        //  A) pixi.Ticker.delta * velocity is "pixels per frame"
        //  B) pixi.Ticker.elapsedMS / 1000 * velocity is "pixels per second"
        this.sceneHandler.update(this.ticker.elapsedMS / 1000)
        this.renderer.render(this.stage)
    }

    handleResize = (event) => {
        this.renderer.view.width = event.target.innerWidth
        this.renderer.view.height = event.target.innerHeight
    }
}

export default Game