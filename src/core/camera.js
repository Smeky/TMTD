import { Container } from "pixi.js"
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
     * @param {boolean} options.zoomEnabled enable wheel events for zoom in and out
     */
    constructor(options = {}) {
        super()

        this.options = {
            zoomEnabled: false,
            dragEnabled: false,
            ...options,
        }

        this.isDragging = false
        this.interactive = true

        if (this.options.zoomEnabled) {
            window.addEventListener("wheel", this.onWheelEvent)
        }

        if (this.options.dragEnabled) {
            this.on("pointerdown", this.onDragStart)
            this.on("pointerup", this.onDragEnd)
            this.on("pointerupoutside", this.onDragEnd)
            this.on("pointermove", this.onDragMove)
        }
    }

    close() {
        if (this.options.zoomEnabled) {
            window.removeEventListener("wheel", this.onWheelEvent)
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
        if (this.isDragging) {
            // Todo:fix: Problem with the order of callbacks registered with pointerup
            //           .. some places get the event first so this doesn't work
            event.stopPropagation()
        }

        this.isDragging = false
    }

    onDragMove = (event) => {
        if (this.isDragging) {
            this.x += event.data.originalEvent.movementX
            this.y += event.data.originalEvent.movementY
        }
    }

    /**
     * Can be either negative or positive (zoom IN and OUT)
     * @param {number} delta // Consider 1 as base value, not required though
     */
    zoom(value) {
        // Todo: test if event.deltaY on wheel is different in other browsers
        const zoomSpeed = 10 // just to name it ;)
        const delta = (value / 100) * this.scale.x * zoomSpeed

        this.scale.x = utils.round(this.scale.x - delta, 1)
        this.scale.y = utils.round(this.scale.y - delta, 1)
    }
}
