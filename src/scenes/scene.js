import { Layers } from "game/graphics/layers"

export default class Scene extends Layers {
    static __Name = null

    constructor() {
        super()
        this.name = this.constructor.__Name
    }

    update(delta) {}
    close() {}
}
