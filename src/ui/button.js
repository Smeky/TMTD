import { createRectTexture } from "game/utils"
import { Rect, Vec2 } from "game/graphics"
import { DisplayObject, Graphics, Sprite } from "pixi.js"
import { ButtonBase } from "."

const DefaultOptions = {
    hoverEnabled: true,
    pressedEnabled: true,
}

export default class Button extends ButtonBase {
    /**
     * 
     * @param {DisplayObject} displayObject 
     * @param {DefaultOptions} options 
     */
    constructor(displayObject, options = {}) {
        super()

        this.options = {
            ...DefaultOptions,
            ...options
        }

        { // graphics
            if (this.options.hoverEnabled) {
                this.border = new Graphics()
                this.border.visible = false // hidden by default, not hovered
                this.border.alpha = 0.3
                this.addChild(this.border)
            }

            if (this.options.pressedEnabled) {
                this.sprite = new Sprite()
                this.sprite.visible = false // hidden by default, not pressed
                this.sprite.alpha = 0.1
                this.addChild(this.sprite)
            }

            this.displayObject = null

            if (displayObject) {
                this.setDisplayObject(displayObject)
            }
        }
    }

    setDisplayObject(displayObject, borderOffset = new Vec2(6, 6)) {
        if (this.displayObject) {
            this.removeChild(this.displayObject)
        }

        this.displayObject = displayObject
        this.addChild(this.displayObject)

        const { width, height } = this.displayObject.getLocalBounds()
        const bounds = new Rect(
            0, 0, 
            width + borderOffset.x * 2, 
            height + borderOffset.y * 2,
        )

        if (this.options.pressedEnabled) {
            this.sprite.texture = createRectTexture(bounds, 0xffffff)
        }

        if (this.options.hoverEnabled) {
            this.border.lineStyle(1, 0xffffff)
            this.border.drawRect(bounds.x, bounds.y, bounds.w, bounds.h)
            this.border.endFill()
        }

        this.pivot.x = Math.round(bounds.w / 2)
        this.pivot.y = Math.round(bounds.h / 2)

        this.displayObject.x += borderOffset.x
        this.displayObject.y += borderOffset.y
    }

    onMouseDown() {
        if (this.options.pressedEnabled) {
            this.sprite.visible = true
        }
    }

    onMouseUp() {
        if (this.options.pressedEnabled) {
            this.sprite.visible = false
        }
    }

    onMouseOver() {
        if (this.options.hoverEnabled) {
            this.border.visible = true
        }
    }

    onMouseOut() {
        if (this.options.hoverEnabled) {
            this.border.visible = false
        }
    }
}