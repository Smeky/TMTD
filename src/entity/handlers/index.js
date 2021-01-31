import { PropertyHandler } from "./property"
import { DisplayHandler } from "./display"
import { MovementHandler } from "./movement"

export default {
    [PropertyHandler.HandlerName]: PropertyHandler,
    [DisplayHandler.HandlerName]: DisplayHandler,
    [MovementHandler.HandlerName]: MovementHandler,
}