import * as pixi from "pixi.js"
import { Debug } from "game/debug"
import InputHandler from "game/core/input"
import EventEmitter from "eventemitter3"
import { Button } from "game/ui/button"

import {
    SceneHandler,
    LevelScene, 
    EditorScene, 
    TomGroundScene
} from "game/scene"
import { Vec2 } from "./core/structs"

pixi.utils.skipHello()

class Game extends EventEmitter {
    constructor() {
        super()
    }

    get width() {
        return this.renderer.view.width
    }

    get height() {
        return this.renderer.view.height
    }

    init() {
        const width = window.innerWidth
        const height = window.innerHeight

        this.input = new InputHandler()
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

        this.setupScene()
        
        this.debug = new Debug()
        this.debug.pivot.x = -this.stage.pivot.x
        this.debug.pivot.y = -this.stage.pivot.y
        this.stage.addChild(this.debug)

        this.firstUpdate = true
    }

    setupScene() {
        // Scene init should be last
        this.sceneHandler = new SceneHandler()
        this.sceneHandler.setScene(LevelScene)

        // Buttons to switch between scenes 
        {
            const style = {fill: "#ffffff", fontSize: 18}

            const level     = new Button(new pixi.Text("Level Scene",  style))
            const editor    = new Button(new pixi.Text("Editor Scene", style))
            const tomground = new Button(new pixi.Text("Tom's Ground", style))

            level.onClick(() => this.sceneHandler.setScene(LevelScene))
            editor.onClick(() => this.sceneHandler.setScene(EditorScene))
            tomground.onClick(() => this.sceneHandler.setScene(TomGroundScene))

            const y = Math.round(-window.innerHeight / 2 + 30)

            level.position.x = -150
            level.position.y = y
            editor.position.y = y
            tomground.position.x = 150
            tomground.position.y = y
            
            this.stage.addChild(level)
            this.stage.addChild(editor)
            this.stage.addChild(tomground)
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

        // We don't use delta, since we want option (B)
        //  A) pixi.Ticker.delta * velocity is "pixels per frame"
        //  B) pixi.Ticker.elapsedMS / 1000 * velocity is "pixels per second"
        const fixedDelta = this.ticker.elapsedMS / 1000
        
        this.sceneHandler.update(fixedDelta)
        this.debug.update(fixedDelta)

        this.renderer.render(this.stage)
    }

    handleResize = (event) => {
        const {view} = this.renderer

        const forward = {
            before: new Vec2(view.width, view.height),
            after: new Vec2(event.target.innerWidth, event.target.innerHeight)
        }

        view.width = event.target.innerWidth
        view.height = event.target.innerHeight

        this.emit("windowResized", forward)
    }
}

export default Game