import { Rect, Vec2 } from "game/core/structs"
import * as pixi from "pixi.js"
import utils from "game/utils"

export class Button extends pixi.Container {
    constructor(text) {
        super()

        { // graphics
            this.border = new pixi.Graphics()
            this.sprite = new pixi.Sprite()

            this.border.visible = false // hidden by default, not hovered
            this.sprite.visible = false // hidden by default, not pressed

            this.border.alpha = 0.5
            this.sprite.alpha = 0.1
            
            this.addChild(this.sprite)
            this.addChild(this.border)

            this.text = null

            if (text) {
                this.setText(text)
            }
        }

        { // events
            this._onClick = null
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

    setText(text) {
        if (this.text) {
            this.removeChild(this.text)
        }

        this.text = text
        this.addChild(this.text)

        const { width, height } = this.text.getLocalBounds()
        const offset = new Vec2(10, 6)
        const bounds = new Rect(
            0, 0, 
            width + offset.x * 2, 
            height + offset.y * 2,
        )

        this.sprite.texture = utils.createRectTexture(bounds, 0xffffff)

        this.border.lineStyle(1, 0xffffff)
        this.border.drawRect(bounds.x, bounds.y, bounds.w, bounds.h)
        this.border.endFill()

        this.pivot.x = Math.round(bounds.w / 2)
        this.pivot.y = Math.round(bounds.h / 2)

        this.text.x += offset.x
        this.text.y += offset.y
    }

    setHover(state) {
        this.border.visible = state
    }

    setPressed(state) {
        this.isPressed = state
        this.sprite.visible = state
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