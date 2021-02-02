import { EntityHandler } from "./handler"

export class DisplayHandler extends EntityHandler {
    constructor() {
        super("display")
    }

    createComponent(opts = {}) {
        return {
            object: opts.object || null
        }
    }

    initComponent(entity) {
        this.updateDisplayPosition(entity)
    }

    closeComponent(entity) {
        const {display} = entity.components

        if (display.object) {
            display.object.parent.removeChild(display.object)
        }
    }

    update(entities, delta) {
        for (const entity of entities) {
            this.updateDisplayPosition(entity)
        }
    }

    updateDisplayPosition(entity) {
        const {display, transform} = entity.components

        if (display.object && transform) {
            display.object.x = transform.pos.x
            display.object.y = transform.pos.y
        }
    }
}
