import { TransformHandler } from "./transform"
import { DisplayHandler } from "./display"
import { MovementHandler } from "./movement"
import { HealthHandler } from "./health"

export default {
    "transform": TransformHandler,
    "display": DisplayHandler,
    "movement": MovementHandler,
    "health": HealthHandler,
}