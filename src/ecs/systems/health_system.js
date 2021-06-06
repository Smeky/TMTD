import { Sprite } from "pixi.js"
import { ECSSystem } from "."

export default class HealthSystem extends ECSSystem {
    static Dependencies = ["transform", "display", "health"]

    setupEntity(entity) {
        const { health } = entity.components

        health.sprite = new Sprite(game.assets.HealthBar)
        health.sprite.anchor.set(0.0, 0.5)
        health.container.addChild(health.sprite)

        this.updateHealthBar(entity)     
    }

    updateEntity(delta, entity, entities) {
        const { health } = entity.components

        if (health.current <= 0) {
            health.current = 0
            
            if (health.onZeroHealth) {
                health.onZeroHealth(entity)
            }
        }

        this.updateHealthBar(entity)
    }

    closeEntity(entity) {
        const { health } = entity.components
        
        health.container.removeChild(health.sprite)
    }

    updateHealthBar(entity) {
        const { transform, display, health } = entity.components
        const { x, y } = transform.position
        const { width, height } = display.getLocalBounds()
        
        health.sprite.width = (width * 1.2) * (health.current / health.maximum)
        health.sprite.height = width * 0.2

        health.sprite.position.x = x - width * 0.6
        health.sprite.position.y = y - height * 0.8

    }
}
