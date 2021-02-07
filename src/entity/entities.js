import { Container } from "pixi.js"
import { Entity } from "."

export default class Entities extends Container {
    constructor() {
        super()

        this.idCounter = 0 // Todo:id: Replace me
    }

    createEntity(components) {
        const entity = new Entity(++this.idCounter, this)
        
        for (const [name, options] of Object.entries(components)) {
            entity.addComponent(name, options)
        }

        this.addChild(entity)
        entity.setupComponents()

        return entity
    }

    removeEntity(id) {
        const entity = this.children.find(e => e.id === id)

        if (!entity) {
            throw "Invalid entity id"
        }

        entity.close()
        this.removeChild(entity)
    }

    update(delta) {
        for (const entity of this.children) {
            entity.update(delta)
        }
    }

    count() {
        return this.children.length
    }
}
