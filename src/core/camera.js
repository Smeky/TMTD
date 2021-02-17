import { Rect, Vec2 } from "game/graphics"
import { Container, Sprite } from "pixi.js"
import utils from "game/utils"

/**
 * - Perhaps camera could serve as a bridge between games and layers. Keeping track,
 *   possibiltiy to exclude some layers from certain effects (shake, ..), etc.
 * 
 */

export class Camera extends Container {
    /**
     * 
     * @param {object} options 
     * @param {boolean} [options.zoomEnabled] [optional] enable wheel events for zoom in and out
     * @param {boolean} [options.dragEnabled] [optional] enable camera movement by pointer dragging
     * @param {boolean} [options.grabDebug] [optional] whether game debug should be affected by camera
     */
    constructor(options = {}) {
        super()

        this.options = {
            size: new Vec2(0, 0),
            zoomEnabled: false,
            dragEnabled: false,
            grabDebug: false,
            ...options,
        }

        this.background = new Sprite(utils.createRectTexture(new Rect(0, 0, options.size.x, options.size.y)))
        this.background.alpha = 0
        this.background.interactive = true
        this.background.pivot.copyFrom(this.pivot)
        this.once("added", () => this.parent.addChildAt(this.background, 0))

        this.hasMoved = false
        this.isDragging = false
        this.interactive = true

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

        if (this.options.grabDebug) {
            this.debugParent = game.debug.parent
            this.debugParent.removeChild(game.debug)
            this.addChild(game.debug)
        }
    }

    close() {
        if (this.options.zoomEnabled) {
            window.removeEventListener("wheel", this.onWheelEvent)
        }

        if (this.options.grabDebug) {
            this.removeChild(game.debug)
            this.debugParent.addChild(game.debug)
        }
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

    /**
     * Zooms the camera in or out
     * @param {number} value // any positive (zoom in) or negative (zoom out) number
     */
    zoom(value) {
        const delta = - Math.sign(value) / 10  // +/- 0.1
        const change = delta * this.scale.x
        const scale = Math.max((this.scale.x + change), 0.1)

        const bounds = this.getBounds()
        const mousePos = new Vec2(game.renderer.plugins.interaction.mouse.global)

        this.x -= ((mousePos.x - bounds.x) / bounds.width) * (bounds.width * delta)
        this.y -= ((mousePos.y - bounds.y) / bounds.height) * (bounds.height * delta)

        this.scale.x = scale
        this.scale.y = scale
    }

    correctMousePos(pos) {
        return this.toLocal(pos)
    }
}
