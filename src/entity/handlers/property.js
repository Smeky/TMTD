import { EntityHandler } from "./handler"
import { Vec2 } from "game/core/structs"

export class PropertyHandler extends EntityHandler {
    static HandlerName = "property"

    static createComponent() {
        return {
            pos: new Vec2(0, 0)
        }
    }
}
