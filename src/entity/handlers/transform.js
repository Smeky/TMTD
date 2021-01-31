import { EntityHandler } from "./handler"
import { Vec2 } from "game/core/structs"

export class TransformHandler extends EntityHandler {
    static HandlerName = "transform"

    static createComponent() {
        return {
            pos: new Vec2(0, 0)
        }
    }
}
