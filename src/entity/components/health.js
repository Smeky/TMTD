import utils from "game/utils"
import { Rect } from "game/graphics"
import { Sprite } from "pixi.js"
import { Entity } from ".."
import { Component } from "."

export default class HealthComponent extends Component {
    /**
     * 
     * @param {Entity} entity 
     * @param {object} options 
     * @param {number} options.maximum   maximum amount of health
     * @param {number} options.armor     0-1, 1 as total immunity
     * @param {number} [options.current] [optional] current amount of health
     * @param {number} [options.parent] [optional] parent for the displayObject. Otherwise falls under Entity
     */
    constructor(entity, options) {
        super(entity) 

        this.useStatsComponent = options.useStatsComponent || false
        this.maximum = options.maximum || 0
        this.armor = options.armor || 0
        this.current = options.current || this.maximum
        this.parent = options.parent || this.entity
        
        this.maxWidth = 0
        this.sprite = new Sprite(utils.createRectTexture(new Rect(0, 0, 20, 4), 0xff0000))
        this.parent.addChild(this.sprite)
    }

    setup() {
        this.transform = this.entity.ensureComponent("transform")

        if (this.useStatsComponent) {
            this.stats = this.entity.ensureComponent("stats")
            this.maximum = this.stats.current.health
            this.current = this.current
        }

        const display = this.entity.getComponent("display")

        if (display) {
            const {width, height} = display.displayObject.getLocalBounds()
            
            this.sprite.width = width + width / 2.5
            this.sprite.pivot.y = height / 2 + 10

            this.maxWidth = this.sprite.width
        }

        this.updateBar()
    }

    close() {
        this.parent.removeChild(this.sprite)
    }

    update(delta) {
        this.updateBar()
    }

    updateBar() {
        this.sprite.width = this.maxWidth * (this.current / this.maximum)

        if (this.transform) {
            this.sprite.x = this.transform.pos.x - this.maxWidth / 2
            this.sprite.y = this.transform.pos.y
        }
    }

    /**
     * 
     * @param {number} value reduce the health by
     * @returns {boolean} returns true if new health <= 0, false otherwise
     */
    reduce(value) {
        this.current -= value * (1 - this.armor)

        if (this.current <= 0) {
            this.current = 0
            this.entity.emit("entity_health_zero")
            return true
        }

        return false
    }

    add(value) {
        this.current += value

        if (this.current >= this.maximum) {
            this.current = this.maximum
        }
    }

    isAlive() {
        return this.current > 0
    }
}
