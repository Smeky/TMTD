import { Rect } from "game/graphics"
import utils from "game/utils"
import { DisplayObject, Sprite } from "pixi.js"
import { Entity } from ".."
import { Component } from "."

export default class HealthComponent extends Component {
    static __Name = "health"

    /**
     * 
     * @param {Entity} entity 
     * @param {object} options 
     * @param {number} options.maximum   maximum amount of health 
     * @param {number} [options.current] [optional] current amount of health
     */
    constructor(entity, options) {
        super(entity) 

        this.transform = null
        this.maximum = options.maximum || 0
        this.current = options.current || this.maximum
        
        this.sprite = new Sprite(utils.createRectTexture(new Rect(0, 0, 20, 4), 0xff0000))
        this.entity.addChild(this.sprite)
    }

    setup() {
        this.transform = this.entity.getComponent("transform")
        const display = this.entity.getComponent("display")

        if (display) {
            const {width, height} = display.displayObject.getLocalBounds()
            
            this.sprite.pivot.x = this.sprite.getLocalBounds().width / 2
            this.sprite.pivot.y = height / 2 + 10
            this.sprite.width = width + width / 2.5
        }

        this.updatePosition()
    }

    close() {
        this.entity.removeChild(this.sprite)
    }

    update(delta) {
        this.updatePosition()
    }

    updatePosition() {
        if (this.transform) {
            this.sprite.x = this.transform.pos.x
            this.sprite.y = this.transform.pos.y
        }
    }
}
