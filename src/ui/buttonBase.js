import { Container } from "pixi.js"

export default class ButtonBase extends Container {
    constructor() {
        super()

        this.isPressed = false
        this.isHover = false
        this.interactive = true

        this.on("pointerdown", this.handleMouseDown)
        this.on("pointerup", this.handleMouseUp)
        this.on("pointerupoutside", this.handleMouseUpOutside)
        this.on("pointerover", this.handleMouseOver)
        this.on("pointerout", this.handleMouseOut)
    }

    handleMouseDown = (event) => {
        event.stopPropagation()
        this.isPressed = true
        this.onMouseDown()
    }
    
    handleMouseUp = (event) => {
        if (this.isPressed) {
            event.stopPropagation()
        }

        this.isPressed = false
        this.onMouseUp()
    }

    handleMouseUpOutside = () => {
        this.isPressed = false
        this.onMouseUp()
    }
    
    handleMouseOver = () => {
        this.isHover = true
        this.onMouseOver()
    }
    
    handleMouseOut = () => {
        this.isHover = false
        this.onMouseOut()
    }

    onMouseDown() {}
    onMouseUp() {}
    onMouseOver() {}
    onMouseOut() {}
}