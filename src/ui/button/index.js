import { DisplayObject } from "pixi.js"
import { ButtonBase } from ".."
import DefaultStyleHandler from "./button_style_handler"

export default class Button extends ButtonBase {
    /**
     * @param {Object} options
     * @param {DisplayObject} options.icon
     * @param {ButtonStyleHandler} options.styleHandler
     */
    constructor(options) {
        super({
            icon: null,
            styleHandler: DefaultStyleHandler,
            ...options, 
        })

        this.icon = null
        this.styleHandler = null

        if (this.options.styleHandler) {
            this.styleHandler = new this.options.styleHandler(this)
        }

        if (this.options.icon) {
            this.setIcon(this.options.icon)
        }
    }

    /** @param {DisplayObject} icon */
    setIcon(icon) {
        this.icon = icon
        this.addChild(this.icon)
        
        const { width, height } = this.getLocalBounds()
        this.pivot.x = width / 2
        this.pivot.y = height / 2
    }

    onStateChange(prevState, newState) {
        if (this.styleHandler) {
            this.styleHandler.update(this, prevState)
        }
    }
}
