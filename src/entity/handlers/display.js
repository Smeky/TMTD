import { EntityHandler } from "./handler"

export class DisplayHandler extends EntityHandler {
    static HandlerName = "display"

    static createComponent() {
        return {
            object: null
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
        const display = entity.components.display
        const transform = entity.components.transform

        if (display.object && transform) {
            display.object.x = transform.pos.x
            display.object.y = transform.pos.y
        }
    }
}
