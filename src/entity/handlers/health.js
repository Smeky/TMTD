import { EntityHandler } from "./handler"
import { Rect } from "game/core/structs"
import utils from "game/utils"

export class HealthHandler extends EntityHandler {
    constructor() {
        super("health")
    }

    createComponent(opts = {}) {
        const sprite = utils.createRectSprite(new Rect(0, 0, 20, 4), 0xff0000)

        if (opts.parent) {
            opts.parent.addChild(sprite)
        }

        return {
            current: typeof opts.current === "undefined" ? 100 : opts.current,
            maximum: typeof opts.maximum === "undefined" ? 100 : opts.maximum,
            healthBar: sprite
        }
    }

    initComponent(entity) {
        this.updateDisplayPosition(entity)
    }

    closeComponent(entity) {
        const {health} = entity.components

        if (health.healthBar.parent) {
            health.healthBar.parent.removeChild(health.healthBar)
        }
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
