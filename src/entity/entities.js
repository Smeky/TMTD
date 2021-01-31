import Handlers from "game/entity/handlers"

class Entity {
    constructor(id) {
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

export class Entities extends Array {
    constructor(...args) {
        super(...args)

        this.idCounter = 0 // Todo:id: Replace me
        this.handlers = []
    }

    createEntity() {
        this.push(new Entity(++this.idCounter))
        return this[this.length - 1]
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
            const entities = this.filterEntitiesByHandler(this, handler.constructor.HandlerName)
            handler.update(entities, delta)
        }
    }
}