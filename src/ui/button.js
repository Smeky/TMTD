import { Rect, Vec2 } from "game/graphics"
import * as pixi from "pixi.js"
import utils from "game/utils"

const DefaultOptions = {
    hoverEnabled: true,
    pressedEnabled: true,
    onClick: null,
}

export class Button extends pixi.Container {
    /**
     * 
     * @param {pixi.DisplayObject} displayObject 
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
                this.border = new pixi.Graphics()    
                this.border.visible = false // hidden by default, not hovered
                this.border.alpha = 0.3
                this.addChild(this.border)
            }

            if (this.options.pressedEnabled) {
                this.sprite = new pixi.Sprite()
                this.sprite.visible = false // hidden by default, not pressed
                this.sprite.alpha = 0.1
                this.addChild(this.sprite)
            }

            this.displayObject = null

            if (displayObject) {
                this.setDisplayObject(displayObject)
            }
        }

        { // events
            this._onClick = options.onClick
            this.isPressed = false
            this.interactive = true

            this.on("mouseover", () => this.setHover(true))
            this.on("mouseout", () => this.setHover(false))
            this.on("mouseupoutside", () => {this.setPressed(false)})
            this.on("mousedown", (event) => {
                this.setPressed(true)
                event.stopPropagation()

            })
            this.on("mouseup", (event) => {
                if (this.isPressed) {
                    this.handleClick()
                    event.stopPropagation()
                }

                this.setPressed(false)
            })
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
            this.sprite.texture = utils.createRectTexture(bounds, 0xffffff)
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

    setHover(state) {
        if (this.options.hoverEnabled) {
            this.border.visible = state
        }
    }

    setPressed(state) {
        this.isPressed = state

        if (this.options.pressedEnabled) {
            this.sprite.visible = state
        }
    }

    handleClick() {
        if (this._onClick) {
            this._onClick()
        }
    }

    onClick(callback) {
        this._onClick = callback
    }
}