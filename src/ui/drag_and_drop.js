import { EventEmitter } from "eventemitter3";
import { Container, utils } from "pixi.js";
import { Game } from "..";

export default class DragAndDrop extends Container {
    constructor() {
        super()

        this.options = {}
        this.visible = false
        this.type = null
    }

    setup(options) {
        this.options = { ...options }
        this.visible = true
        this.type = options.type
        
        if (this.options.sprite) {
            this.addChild(this.options.sprite)

            const mousePos = Game.interaction.mouse.global
            this.position.copyFrom(mousePos)
        }
        
        Game.interaction.on("pointermove", this.onPointerMove)
        Game.interaction.once("pointerup", this.onPointerUp)
    }

    reset() {
        this.visible = false
        this.options = {}
        this.type = null

        Game.interaction.removeListener("pointermove", this.onPointerMove)
        this.removeChildren()
    }

    conclude() {
        const data = this.options.data

        this.reset()

        return data
    }

    onPointerMove = (event) => {
        this.position.copyFrom(event.data.global)
    }

    onPointerUp = (event) => {
        const target = Game.interaction.hitTest(event.data.global)

        if (target && (target instanceof utils.EventEmitter || target instanceof EventEmitter)) {
            target.emit("dragdrop", this)
        }

        // If Drag n' drop doesn't get concluded after the emit above, it stays visible
        if (this.visible && this.options.onCancel) {
            this.options.onCancel()
            this.reset()
        }
    }
}
