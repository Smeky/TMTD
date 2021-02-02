import Handlers from "game/entity/handlers"
import EventEmitter from "eventemitter3"

class Entity extends EventEmitter {
    constructor(id) {
        super()
        this.id = id
        this.needsInit = true
        this.components = {}
    }

    addComponent(name) {
        const component = Handlers[name].createComponent()
        this.components[name] = component
        return this.components[name]
    }

    hasComponent(name) {
        return this.components.hasOwnProperty(name)
    }
}

export class Entities {
    constructor() {
        this.idCounter = 0 // Todo:id: Replace me
        this.handlers = []
        this.entities = []
    }

    createEntity() {
        this.entities.push(new Entity(++this.idCounter))
        return this.entities[this.entities.length - 1]
    }

    removeEntity(id) {
        this.entities = this.entities.filter(e => e.id !== id)
    }

    initEntity(entity) {
        // Ensure we have handler for all components this entity has
        const names = Object.keys(entity.components)
        const missing = names.filter(name => !this.handlers.find(handler => handler.constructor.HandlerName === name))

        missing.forEach(name => this.addHandler(name))

        // Let each handler init its component within the entity
        for (const handler of this.handlers) {
            if (entity.hasComponent(handler.constructor.HandlerName)) {
                handler.initComponent(entity)
            }
        }
    }

    addHandler(name) {
        if (process.env.NODE_ENV === "development") {
            console.log("Adding handler to entities -", name)
        }

        this.handlers.push(new Handlers[name])
    }

    filterEntitiesByHandler(entities, name) {
        return entities.filter(entity => entity.hasComponent(name))
    }

    update(delta) {
        for (const handler of this.handlers) {
            const entities = this.filterEntitiesByHandler(this.entities, handler.constructor.HandlerName)
            handler.update(entities, delta)
        }
    }

    count() {
        return this.entities.length
    }
}