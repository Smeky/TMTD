import { Vec2 } from "game/graphics"
import { DisplayObject } from "pixi.js"
import { Entity } from ".."
import { Component } from "."

export default class DisplayComponent extends Component {
    static ComponentName = "Display"
    static Dependencies = { optional: ["Transform"] }

    /**
     * 
     * @param {Entity} entity 
     * @param {object} options 
     * @param {DisplayObject} [options.displayObject] [optional] the display objec that will represent the entity
     * @param {Container} [options.parent] [optional] parent for the displayObject. Otherwise falls under Entity
     * @param {Vec2} [options.anchor] [optional] anchor of the display object
     */
    constructor(entity, options) {
        super(entity) 

        this.displayObject = null

        this.parent = options.parent || this.entity
        this.anchor = options.anchor || new Vec2(0.5, 0.5)

        if (options.displayObject) {
            this.setDisplayObject(options.displayObject)
        }
    }

    setup() {
        this.updatePosition()
    }

    close() {
        if (this.displayObject) {
            this.parent.removeChild(this.displayObject)
        }
    }

    update(delta) {
        this.updatePosition()
    }

    updatePosition() {
        if (this.displayObject  && this.dependencies.Transform) {
            this.displayObject.position.copyFrom(this.dependencies.Transform.position)
        }
    }

    setDisplayObject(obj) {
        this.displayObject = obj

        if (this.displayObject.hasOwnProperty("anchor")) {
            this.displayObject.anchor.set(this.anchor.x, this.anchor.y)
        }
        else {
            const { width, height } = this.displayObject.getLocalBounds()
            this.displayObject.pivot.x = Math.round(this.anchor.x * width)
            this.displayObject.pivot.y = Math.round(this.anchor.y * height)
        }

        this.parent.addChild(this.displayObject)
    }

    setRotation(angle) {
        if (this.displayObject) {
            this.displayObject.rotation = angle
        }
    }
}
