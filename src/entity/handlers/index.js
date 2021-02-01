import { TransformHandler } from "./transform"
import { DisplayHandler } from "./display"
import { MovementHandler } from "./movement"
import { HealthHandler } from "./health"

export default {
    [TransformHandler.HandlerName]: TransformHandler,
    [DisplayHandler.HandlerName]: DisplayHandler,
    [MovementHandler.HandlerName]: MovementHandler,
    [HealthHandler.HandlerName]: HealthHandler,
}