import { Container } from "pixi.js";
import { Game } from "..";
import DropTarget from "./drop_target";

export default class DragAndDrop extends Container {
    constructor() {
        super()

        this.options = {}
        this.visible = false
    }

    setup(options) {
        this.options = { ...options }
        this.visible = true
        
        if (this.options.sprite) {
            this.addChild(this.options.sprite)

            const { width, height } = this.getLocalBounds()
            this.pivot.x = width / 2
            this.pivot.y = height / 2

            const mousePos = Game.interaction.mouse.global
            this.position.copyFrom(mousePos)
        }
        
        Game.interaction.on("pointermove", this.onPointerMove)
        Game.interaction.once("pointerup", this.onPointerUp)
    }

    reset() {
        this.visible = false

        Game.interaction.removeListener("pointermove", this.onPointerMove)
        this.removeChildren()
    }

    onPointerMove = (event) => {
        this.position.copyFrom(event.data.global)
    }

    onPointerUp = (event) => {
        const target = Game.interaction.hitTest(event.data.global)

        if (target && target instanceof DropTarget) {
            target.handleDragDrop(this.options.data)
        }
        else if (this.options.onCancel) {
            this.options.onCancel()
        }

        this.reset()
    }
}
