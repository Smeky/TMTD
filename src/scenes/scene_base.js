import { Layers } from "game/graphics"
import { createModulesStore } from "./level/modules"

export default class SceneBase extends Layers {
    static Name = null

    constructor() {
        super()
        this.name = this.constructor.Name
        this.started = false

        // Creates a { name: module } structure from a list of modules
        //   - So we can do game.scene.modules.myModule.doSomething
        //   - Note that this should probably not be used too often as we want to rely on events
        this.modules = createModulesStore(this, this.constructor.Modules || [])
    }

    get moduleList() {
        return Object.values(this.modules)
    }

    async load() {
        await Promise.all(this.moduleList.map(async (module) => await module.load()))
    }
    
    /**
     * @override
     */
    setupScene() {}
    setup() {
        for (const module of this.moduleList) {
            module.setup()
        }

        this.setupScene()
    }

    /**
     * @override
     */
    closeScene() {}
    close() {
        for (const module of this.moduleList) {
            module.close()
        }

        this.closeScene()        
    }

    /**
     * @override
     */
    update(delta) {}
}
