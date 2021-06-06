import { ECSSystem } from "."

export default class TransformDisplaySync extends ECSSystem {
    static Dependencies = ["transform", "display"]

    setupEntity(entity) {
        this.updateDisplayTransform(entity)
    }

    updateEntity(delta, entity, entities) {
        this.updateDisplayTransform(entity)
    }

    closeEntity(entity) {
        const { display } = entity.components

        if (display) {
            display.parent.removeChild(display)
        }
    }

    updateDisplayTransform(entity) {
        const { transform, display } = entity.components

        // Display can still be null when none is set
        if (display) {
            display.position.copyFrom(transform.position)
            display.scale.copyFrom(transform.scale)
            display.rotation = transform.rotation
        }
    }
}
