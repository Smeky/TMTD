import { EntityHandler } from "./handler"
import { Vec2 } from "game/core/structs"

export class TransformHandler extends EntityHandler {
    DefaultTransform = {
        pos: new Vec2(0, 0)
    }

    constructor() {
        super("transform")
    }

    createComponent(opts) {
        return {
            ...this.DefaultTransform,
            ...opts
        }
    }
}
