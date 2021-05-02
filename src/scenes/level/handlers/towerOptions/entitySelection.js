import { GlowFilter } from "pixi-filters";
import { Container } from "pixi.js";

export default class EntitySelection extends Container {
    constructor() {
        super()

        this.selected = null
    }

    selectEntity(entity) {
        if (this.selected) {
            this.removeEntityEffect(this.selected)

            if (this.selected.id === entity.id) {
                this.selected = null
                return // clicked the same entity, just unselecte
            }
        }

        this.selected = entity
        this.addEntityEffect(this.selected)
    }

    addEntityEffect(entity) {
        entity.filters = [
            new GlowFilter({
                color: 0xdae2e8,
                quality: 2,
                outerStrength: 2,
            })
        ]
    }

    removeEntityEffect(entity) {
        entity.filters = []
    }

    clearSelection() {
        if (this.selected) {
            this.removeEntityEffect(this.selected)
            this.selected = null
        }
    }

    hasSelected() {
        return !!this.selected
    }
}