import * as pixi from "pixi.js"
import Debugger from "game/debug"
import InputHandler from "game/core/input"
import EventEmitter from "eventemitter3"

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
            level.position.x = -150
            level.position.y = -window.innerHeight / 2 + 30
            level.interactive = true
            level.on("mouseup", () => this.sceneHandler.setScene(LevelScene))
            level.addChild(new pixi.Text("Level Scene", {fill: "#ffffff", fontSize: 18}))
            level.pivot.x = level.getLocalBounds().width / 2
    
            const editor = new pixi.Container()
            editor.position.y = -window.innerHeight / 2 + 30
            editor.interactive = true
            editor.on("mouseup", () => this.sceneHandler.setScene(EditorScene))
            editor.addChild(new pixi.Text("Editor Scene", {fill: "#ffffff", fontSize: 18}))
            editor.pivot.x = editor.getLocalBounds().width / 2
            
            const tomground = new pixi.Container()
            tomground.position.x = 150
            tomground.position.y = -window.innerHeight / 2 + 30
            tomground.interactive = true
            tomground.on("mouseup", () => this.sceneHandler.setScene(TomGroundScene))
            tomground.addChild(new pixi.Text("Tom's Ground", {fill: "#ffffff", fontSize: 18}))
            tomground.pivot.x = tomground.getLocalBounds().width / 2
            
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
        this.sceneHandler.update(this.ticker.elapsedMS / 1000)
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