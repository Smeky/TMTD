import { TransformHandler } from "./transform"
import { DisplayHandler } from "./display"
import { MovementHandler } from "./movement"

export default {
    [TransformHandler.HandlerName]: TransformHandler,
    [DisplayHandler.HandlerName]: DisplayHandler,
    [MovementHandler.HandlerName]: MovementHandler,
}