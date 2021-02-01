import { EntityHandler } from "./handler"
import { Sprite } from "pixi.js"
import { Rect } from "game/core/structs"
import utils from "game/utils"

export class HealthHandler extends EntityHandler {
    static HandlerName = "health"

    static createComponent() {
        return {
            current: 100,
            maximum: 100,
            healthBar: utils.createRectSprite(new Rect(0, 0, 20, 4), 0xff0000),
        }
    }

    initComponent(entity) {
        this.updateDisplayPosition(entity)
    }

    update(entities, delta) {
        for (const entity of entities) {
            this.updateDisplayPosition(entity)
        }
    }

    updateDisplayPosition(entity) {
        const {health, transform} = entity.components
        
        health.healthBar.scale.x = health.current / health.maximum

        if (transform) {
            health.healthBar.x = transform.pos.x - 10
            health.healthBar.y = transform.pos.y - 16
        }
    }
}
