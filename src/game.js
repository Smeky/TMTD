import { Camera, InputModule } from "game/core"
import EventEmitter from "eventemitter3"
import { Debug } from "game/debug"
import { SceneManager } from "game/scenes"
import { Renderer, Vec2 } from "game/graphics"
import * as pixi from "pixi.js"

pixi.utils.skipHello()

export default class Game extends EventEmitter {
    FPS = 60
    SPF = 1 / this.FPS

    constructor() {
        super()
    }
    
    get scene() {
        return this.sceneManager.scene
    }
    
    init() {
        this.firstUpdate = true
        this.deltaBuffer = 0

        this.input = new InputModule()
        this.renderer = new Renderer()
        this.stage = new pixi.Container()
        this.sceneManager = new SceneManager()
        this.debug = new Debug()
        this.camera = new Camera({
            size: new Vec2(this.renderer.width, this.renderer.height),
            zoomEnabled: true,
            dragEnabled: true,
        })

        this.stage.addChild(this.camera)
        this.stage.addChild(this.sceneManager)
        this.stage.addChild(this.debug)

        window.addEventListener("resize", this.handleResize)
        this.on("change_scene", this.onChangeScene)

        this.sceneManager.setScene("level")

        this.ticker = new pixi.Ticker()
        this.ticker.add(this.update, pixi.UPDATE_PRIORITY.LOW)
        this.ticker.start()
    }

    close() {
        this.removeListener("change_scene", this.onChangeScene)
    }

    onChangeScene = (sceneId) => {
        this.sceneManager.setScene(sceneId)
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

    getCanvasSize() {
        return new Vec2(
            this.renderer.width,
            this.renderer.height,
        )
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
