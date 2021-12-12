import { createRectTexture } from "game/utils"
import { Rect, Vec2, Layers } from "game/graphics"
import { Sprite } from "pixi.js"
import { Game } from ".."

export default class Camera extends Layers {
    /**
     * 
     * @param {object} options 
     * @param {boolean} [options.zoomEnabled] [optional] enable wheel events for zoom in and out
     * @param {boolean} [options.dragEnabled] [optional] enable camera movement by pointer dragging
     * @param {boolean} [options.grabDebug] [optional] whether game debug should be affected by camera
     * @param {boolean} [options.disableInteraction] [optional] Disables most camera functionality, resulting in static view
     */
    constructor(options = {}) {
        super()

        this.options = {
            size: new Vec2(0, 0),
            zoomEnabled: false,
            dragEnabled: false,
            grabDebug: false,
            disableInteraction: false,
            ...options,
        }

        this.backgroundSize = new Vec2(10, 10)
        this.background = new Sprite(createRectTexture(new Rect(0, 0, this.backgroundSize.x, this.backgroundSize.y)))
        this.background.scale.x = this.options.size.x / this.backgroundSize.x
        this.background.scale.y = this.options.size.y / this.backgroundSize.y
        this.background.alpha = 0
        this.background.interactive = true
        this.background.pivot.copyFrom(this.pivot)
        this.once("added", () => this.parent.addChildAt(this.background, 0))

        this.hasMoved = false
        this.isDragging = false
        this.interactive = true

        if (!this.options.disableInteraction) {
            if (this.options.zoomEnabled) {
                window.addEventListener("wheel", this.onWheelEvent)
            }
    
            if (this.options.dragEnabled) {
                this.background.on("pointerdown", this.onDragStart)
                this.background.on("pointerup", this.onDragEnd)
                this.background.on("pointerupoutside", this.onDragEnd)
                this.background.on("pointermove", this.onDragMove)
                this.on("pointerdown", this.onDragStart)
                this.on("pointerup", this.onDragEnd)
                this.on("pointerupoutside", this.onDragEnd)
                this.on("pointermove", this.onDragMove)
            }
        }

        if (this.options.grabDebug) {
            this.debugParent = Game.debug.parent
            this.debugParent.removeChild(Game.debug)
            this.addChild(Game.debug)
        }
    }

    close() {
        if (this.options.zoomEnabled) {
            window.removeEventListener("wheel", this.onWheelEvent)
        }

        if (this.options.grabDebug) {
            this.removeChild(Game.debug)
            this.debugParent.addChild(Game.debug)
        }
    }

    handleViewResize(newSize) {
        // Reposition camera by movement difference / 2
        this.move(newSize.subtract(this.options.size).divide(2))
        this.options.size.copyFrom(newSize)

        // Update background so it covers whole screen
        this.background.scale.x = newSize.x / this.backgroundSize.x
        this.background.scale.y = newSize.y / this.backgroundSize.y
    }

    onWheelEvent = (event) => {
        event.stopPropagation()
        this.zoom(event.deltaY / 100) // zoom accepts 1 as base, so let's give it that
    }

    onDragStart = () => {
        this.isDragging = true
    }

    onDragEnd = (event) => {
        if (this.hasMoved) {
            // Todo:fix: Problem with the order of callbacks registered with pointerup
            //           .. some places get the event first so this doesn't work
            event.stopPropagation()
        }

        this.isDragging = false
        this.hasMoved = false
    }

    onDragMove = (event) => {
        if (this.isDragging) {
            this.hasMoved = true

            this.x += event.data.originalEvent.movementX
            this.y += event.data.originalEvent.movementY

            event.stopPropagation()
        }
    }

    moveTo(pos) {
        this.x = pos.x
        this.y = pos.y
    }

    move(movement) {
        this.x += movement.x
        this.y += movement.y
    }

    /**
     * Zooms the camera in or out
     * @param {number} value // any positive (zoom in) or negative (zoom out) number
     */
    zoom(value) {
        const before = new Vec2(this.scale)
        const delta = - Math.sign(value) / 10  // +/- 0.1
        const change = delta * this.scale.x
        const scale = Math.max((this.scale.x + change), 0.1)

        const bounds = this.getBounds()
        const mousePos = new Vec2(Game.interaction.mouse.global)

        this.x -= ((mousePos.x - bounds.x) / bounds.width) * (bounds.width * delta)
        this.y -= ((mousePos.y - bounds.y) / bounds.height) * (bounds.height * delta)

        this.scale.x = scale
        this.scale.y = scale

        this.emit("zoom", this, before.subtract(this.scale))
    }

    resetZoom() {
        this.scale.set(1, 1)
    }

    correctMousePos(pos) {
        const offset = Game.renderer.getWindowPosition()        
        return new Vec2(this.toLocal(pos)).subtract(offset)
    }

    getMousePos() {
        return new Vec2(this.toLocal(Game.interaction.mouse.global))
    }
}
