import { Camera, InputHandler } from "game/core"
import EventEmitter from "eventemitter3"
import { Debug } from "game/debug"
import { SceneManager } from "game/scenes"
import { Vec2 } from "game/graphics"
import { Button } from "game/ui"
import * as pixi from "pixi.js"

pixi.utils.skipHello()

export default class Game extends EventEmitter {
    FPS = 60
    SPF = 1 / this.FPS

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
        return this.sceneManager.scene
    }
    
    init() {
        this.firstUpdate = true
        this.deltaBuffer = 0

        this.setupRenderer()

        this.debug = new Debug()
        this.camera = new Camera({
            size: new Vec2(game.width, game.height),
            zoomEnabled: true,
            dragEnabled: true,
        })

        this.stage.addChild(this.camera)
        
        this.setupScene()
        this.stage.addChild(this.debug)

        this.ticker = new pixi.Ticker()
        this.ticker.add(this.update, pixi.UPDATE_PRIORITY.LOW)
        this.ticker.start()
    }

    close() {

    }

    setupRenderer() {
        const containerEl = document.getElementById("canvas_container")
        const { width, height } = containerEl.getBoundingClientRect()

        this.input = new InputHandler()
        this.renderer = new pixi.Renderer({ 
            width: width, 
            height: height,
            backgroundColor: 0x1c2433,
            antialias: true,
        })

        this.stage = new pixi.Container()
        
        window.addEventListener("resize", this.handleResize)
        containerEl.append(this.renderer.view)
    }

    setupScene() {
        // Scene init should be last
        this.sceneManager = new SceneManager()
        this.stage.addChild(this.sceneManager)

        {   // Buttons to switch between scenes 
            const style = { fill: "#ffffff", fontSize: 18 }
            const scenes = [
                { id: "level", label: "Level Scene" },
                { id: "editor", label: "Editor Scene" },
            ]

            scenes.forEach((scene, index) => {
                const button = new Button(new pixi.Text(scene.label,  style))
    
                button.on("click", () => this.sceneManager.setScene(scene.id))
                button.pivot.set(0, 0)
                button.x = 20
                button.y = 20 + index * 35
    
                this.stage.addChild(button)
            })
        }

        this.sceneManager.setScene("editor")
    }
    
    run() {
        this.ticker.start()
        this.counter = 0
    }


    update = () => {
        if (this.firstUpdate) {
            this.firstUpdate = false
            return
        }

        // We don't use delta, since we want option (B)
        //  A) pixi.Ticker.delta * velocity is "pixels per frame"
        //  B) pixi.Ticker.elapsedMS / 1000 * velocity is "pixels per second"
        let delta = this.ticker.elapsedMS / 1000 + this.deltaBuffer

        while (delta > 0) {
            delta -= this.SPF

            this.sceneManager.update(this.SPF)
            this.debug.update(this.SPF)
        }

        this.deltaBuffer = delta
        this.renderer.render(this.stage)
    }

    resizeWindow = (width, height) => {
        const mockEvent = {
            target: {
                innerWidth: width,
                innerHeight: height,
            }
        }

        this.handleResize(mockEvent)
    }

    handleResize = (event) => {
        // Todo: [bug] doesn't work because we now have sidebar on the left
        //              - Create a Renderer class and handle everything related there
        //              - Store prev window size, and then viewSize - windowDiff in .resize
        const {view} = this.renderer

        const meta = {
            before: new Vec2(view.width, view.height),
            after: new Vec2(event.target.innerWidth, event.target.innerHeight)
        }

        this.renderer.resize(meta.after.x, meta.after.y)

        this.camera.handleViewResize(meta.after) // Todo: move this to camera, listen to event?
        this.emit("window_resized", meta)
    }
}
