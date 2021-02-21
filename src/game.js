import * as pixi from "pixi.js"
import { Debug } from "game/debug"
import InputHandler from "game/core/input"
import EventEmitter from "eventemitter3"
import { Button } from "game/ui/button"
import { SceneHandler } from "game/scenes"
import { Vec2 } from "game/graphics"

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

    get scene() {
        return this.sceneHandler.scene
    }
    
    init() {
        this.firstUpdate = true

        this.setupGraphics()

        this.debug = new Debug()
        
        this.setupScene()
        this.stage.addChild(this.debug)
    }

    setupGraphics() {
        const width = window.innerWidth
        const height = window.innerHeight

        this.input = new InputHandler()
        this.renderer = new pixi.Renderer({ 
            width: width, 
            height: height,
            backgroundColor: 0x1c2433,
        })

        this.stage = new pixi.Container()

        window.addEventListener("resize", this.handleResize)
        document.body.appendChild(this.renderer.view)

        this.ticker = new pixi.Ticker()
        this.ticker.add(this.update, pixi.UPDATE_PRIORITY.LOW)
        this.ticker.start()
    }

    setupScene() {
        // Scene init should be last
        this.sceneHandler = new SceneHandler()
        this.stage.addChild(this.sceneHandler)

        {   // Buttons to switch between scenes 
            const style = { fill: "#ffffff", fontSize: 18 }
            const scenes = [
                { id: "level", label: "Level Scene" },
                { id: "editor", label: "Editor Scene" },
            ]

            scenes.forEach((scene, index) => {
                const button = new Button(new pixi.Text(scene.label,  style))
    
                button.onClick(() => this.sceneHandler.setScene(scene.id))
                button.pivot.set(0, 0)
                button.x = 20
                button.y = 20 + index * 35
    
                this.stage.addChild(button)
            })
        }

        this.sceneHandler.setScene("level")
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