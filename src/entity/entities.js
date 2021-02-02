import EventEmitter from "eventemitter3"
import Handlers from "game/entity/handlers"

class Entity extends EventEmitter {
    constructor(id) {
        super()
        this._id = id
        this.components = {}
    }

    set id(_) {}
    get id() {
        return this._id
    }
}


export class ECS {
    constructor() {
        this.idCounter = 0 // Todo:id: Replace me
        this.handlers = []
        this.entities = []
    }

    createEntity(components) {
        const entity = new Entity(++this.idCounter)
        
        for (const [name, options] of Object.entries(components)) {
            const component = this.ensureHandler(name).createComponent(options)
            entity.components[name] = component
        }

        this.entities.push(entity)
        return entity
    }

    removeEntity(id) {
        const index = this.entities.findIndex(e => e.id === id)
        const entity = this.entities[index]

        for (const handler of this.handlers) {
            if (this.hasComponent(entity, handler.name)) {
                handler.closeComponent(entity)
            }
        }

        this.entities.splice(index, 1)
    }

    initEntity(entity) {
        // Let each handler init its component within the entity
        for (const handler of this.handlers) {
            if (this.hasComponent(entity, handler.name)) {
                handler.initComponent(entity)
            }
        }
    }

    addComponent(entity, name, opts) {
        const component = this.ensureHandler(name).createComponent(opts)
        entity.components[name] = component
        return component
    }

    hasComponent(entity, name) {
        return entity.components.hasOwnProperty(name)
    }

    getComponent(entity, name) {
        return entity.components[name]
    }

    ensureHandler(name) {
        let handler = this.handlers.find(handler => handler.name === name)

        if (!handler) {
            handler = new Handlers[name]()
            this.handlers.push(handler)
        }

        return handler
    }

    filterEntitiesByHandler(entities, name) {
        return entities.filter(entity => this.hasComponent(entity, name))
    }

    update(delta) {
        for (const handler of this.handlers) {
            const entities = this.filterEntitiesByHandler(this.entities, handler.name)
            handler.update(entities, delta)
        }
    }

    count() {
        return this.entities.length
    }
}