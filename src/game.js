import { World, InputModule } from "game/core"
import EventEmitter from "eventemitter3"
import { Debug } from "game/debug"
import { SceneManager } from "game/scenes"
import { Renderer, Vec2 } from "game/graphics"
import * as pixi from "pixi.js"
import AssetLoader, { AssetList } from "./core/asset_loader"

pixi.utils.skipHello()

export default class Game extends EventEmitter {
    FPS = 120
    SPF = 1 / this.FPS

    get assets() { return this.loader.assets }
    get scene() { return this.sceneManager.scene }
    get isPaused() { return !this.ticker.started }

    beforeLoad() {
        this.deltaBuffer = 0

        this.input = new InputModule()
        this.debug = new Debug()
        this.loader = new AssetLoader()
        this.ticker = new pixi.Ticker()
        this.ticker.add(this.update, pixi.UPDATE_PRIORITY.LOW)

        this.renderer = new Renderer()
        this.stage = new pixi.Container()
        
        this.sceneManager = new SceneManager()
        this.world = new World({
            size: new Vec2(this.renderer.width, this.renderer.height),
            zoomEnabled: true,
            dragEnabled: true,
        })

        this.stage.addChild(this.world)
        this.stage.addChild(this.debug)
        this.world.addChild(this.sceneManager)  // Todo: scene & its modules shouldn't render anything. Use World it self

        window.addEventListener("resize", this.handleResize)
        document.addEventListener("visibilitychange", this.onVisibilityChange);
    }

    async load() {
        await this.loader.loadAssets(AssetList)
    }

    afterLoad() {
        this.sceneManager.setScene("level")
        this.ticker.start()
    }
    
    onVisibilityChange = (event) => {
        const isPaused = event.target.visibilityState === "hidden"

        if (isPaused) this.ticker.stop()
        else          this.ticker.start()

        this.emit("pause_change", isPaused)
    }

    update = () => {
        // We don't use delta, since we want option (B)
        //  A) pixi.Ticker.delta * velocity is "pixels per frame"
        //  B) pixi.Ticker.elapsedMS / 1000 * velocity is "pixels per second"
        let delta = this.ticker.elapsedMS / 1000 + this.deltaBuffer

        while (delta > 0) {
            delta -= this.SPF

            this.world.update(this.SPF)
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

        this.world.handleViewResize(meta.after) // Todo: move this to camera, listen to event?
        this.emit("window_resized", meta)
    }
}
