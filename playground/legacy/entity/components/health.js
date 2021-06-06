import { Sprite } from "pixi.js"
import { Entity } from ".."
import { Component } from "."

export default class HealthComponent extends Component {
    static ComponentName = "Health"
    static Dependencies = { 
        required: ["Transform"],
        optional: ["Display", "Stats"]
    }

    /**
     * 
     * @param {Entity} entity 
     * @param {object} options 
     * @param {number} options.maximum   maximum amount of health
     * @param {number} [options.current] [optional] current amount of health
     * @param {number} [options.parent] [optional] parent for the displayObject. Otherwise falls under Entity
     */
    constructor(entity, options) {
        super(entity) 

        this.useStatsComponent = options.useStatsComponent || false
        this.maximum = options.maximum || 0
        this.current = options.current || this.maximum
        this.parent = options.parent || this.entity
        this.onZeroHealth = options.onZeroHealth || null
        
        this.maxWidth = 0
        this.sprite = new Sprite(game.assets.HealthBar)
        this.parent.addChild(this.sprite)
    }

    setup() {
        if (this.useStatsComponent) {
            this.maximum = this.dependencies.Stats.current.health
            this.current = this.current
        }

        if (this.dependencies.Display) {
            const {width, height} = this.dependencies.Display.displayObject.getLocalBounds()
            
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
        this.sprite.x = this.dependencies.Transform.position.x - this.maxWidth / 2
        this.sprite.y = this.dependencies.Transform.position.y
    }

    /**
     * 
     * @param {number} value reduce the health by
     * @returns {boolean} returns true if new health <= 0, false otherwise
     */
    reduce(value) {
        this.current -= value

        if (this.current <= 0) {
            this.current = 0

            if (this.onZeroHealth) {
                this.onZeroHealth(this.entity)
            }
            
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
