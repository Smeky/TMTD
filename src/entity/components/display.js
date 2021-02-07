import { Vec2 } from "game/core/structs"
import { DisplayObject } from "pixi.js"
import { Entity } from ".."
import { Component } from "."

export default class DisplayComponent extends Component {
    static __Name = "display"

    /**
     * 
     * @param {Entity} entity 
     * @param {object} options 
     * @param {DisplayObject} [options.displayObject] [optional] the display objec that will represent the entity
     * @param {Vec2} [options.anchor] [optional] anchor of the display object
     */
    constructor(entity, options) {
        super(entity) 

        this.transform = null
        this.displayObject = options.displayObject || null
        this.anchor = options.anchor || new Vec2(0.5, 0.5)

        if (this.displayObject) {
            if (this.displayObject.hasOwnProperty("anchor")) {
                this.displayObject.anchor.set(this.anchor.x, this.anchor.y)
            }
            else {
                const { width, height } = this.displayObject.getLocalBounds()
                this.displayObject.pivot.x = Math.round(this.anchor.x * width)
                this.displayObject.pivot.y = Math.round(this.anchor.y * height)
            }

            this.entity.addChild(this.displayObject)
        }
    }

    setup() {
        this.transform = this.entity.getComponent("transform")
        this.updatePosition()
    }

    close() {
        if (this.displayObject) {
            this.entity.removeChild(this.displayObject)
        }
    }

    update(delta) {
        this.updatePosition()
    }

    updatePosition() {
        if (this.displayObject  && this.transform) {
            this.displayObject.x = this.transform.pos.x
            this.displayObject.y = this.transform.pos.y
        }
    }
}
