import { Layers } from "game/graphics"

export default class Scene extends Layers {
    static __Name = null

    constructor() {
        super()
        this.name = this.constructor.__Name
        this.started = false
    }

    async load() { return null }  // Load assets
    setup(loadData) {}  // Gets called when load is finished. prepare whatever is necessary
    close() {}  // Unload, clear, close..

    update(delta) {}
}
