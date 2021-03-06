import { EventEmitter } from "eventemitter3";
import { Vec2 } from "game/graphics";
import { Container, Sprite, utils } from "pixi.js";
import { Game } from "..";

export default class DragAndDrop extends Container {
    constructor() {
        super()

        this.options = {}
        this.visible = false
        this.type = null

        this.icon = new Sprite()
        this.icon.anchor.set(0.5, 0.5)
        this.icon.width = 50
        this.icon.height = 50

        this.addChild(this.icon)
    }

    /**
     * 
     * @param {object} options
     * @param {string} options.type 
     * @param {data} options.any
     * @param {Sprite} options.sprite  Sprite under the mouse
     * @param {function} options.onCancel 
     */
    setup(options) {
        this.options = { ...options }
        this.visible = true
        this.type = options.type

        this.icon.texture = this.options.texture
        this.position.copyFrom(Game.interaction.mouse.global)
        
        Game.interaction.on("pointermove", this.onPointerMove)
        Game.interaction.once("pointerup", this.onPointerUp)
    }

    reset() {
        this.visible = false
        this.options = {}
        this.type = null
        this.icon.texture = null

        Game.interaction.removeListener("pointermove", this.onPointerMove)
    }

    accept() {
        const data = this.options.data
        this.reset()

        return data
    }

    swap(other) {
        if (this.options.onSwap) {
            this.options.onSwap(other)
        }

        return this.accept()
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
