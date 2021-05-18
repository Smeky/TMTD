import { Layers } from "game/graphics"
import { createHandlersStore } from "./level/handlers"

export default class SceneBase extends Layers {
    static Name = null

    constructor() {
        super()
        this.name = this.constructor.Name
        this.started = false

        // Creates a { name: handler } structure from a list of handlers
        //   - So we can do game.scene.handlers.myHandler.doSomething
        //   - Note that this should probably not be used too often as we want to rely on events
        this.handlers = createHandlersStore(this, this.constructor.Handlers || [])
    }

    get handlerList() {
        return Object.values(this.handlers)
    }

    async load() {
        await Promise.all(this.handlerList.map(async (handler) => await handler.load()))
    }
    
    /**
     * @override
     */
    setupScene() { throw "setupScene requires an override" }
    setup() {
        for (const handler of this.handlerList) {
            handler.setup()
        }

        this.setupScene()
    }

    /**
     * @override
     */
    closeScene() { throw "closeScene requires an override" }
    close() {
        for (const handler of this.handlerList) {
            handler.close()
        }

        this.closeScene()        
    }

    /**
     * @override
     */
    update(delta) {}
}
