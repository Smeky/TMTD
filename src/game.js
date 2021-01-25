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

        this.setupScene()
    }

    setupScene() {
        // Scene init should be last
        this.sceneHandler = new SceneHandler()
        this.sceneHandler.setScene(EditorScene)

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
            
            this.graphics.stage.addChild(level)
            this.graphics.stage.addChild(editor)
        }
    }
    
    run() {
        this.ticker.start()
    }

    update = (delta) => {
        // this.graphics.renderer.render(this.graphics.app.stage)
    }
}

export default Game