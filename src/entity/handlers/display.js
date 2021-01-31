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
        const property = entity.components.property

        if (display.object && property) {
            display.object.x = property.pos.x
            display.object.y = property.pos.y
        }
    }
}
