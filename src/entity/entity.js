import Components from "./components"
import { Container } from "pixi.js"
import { EntitySystem } from "."

export default class Entity extends Container {
    /**
     * 
     * @param {*} id 
     * @param {EntitySystem} entitySystem 
     * @param {string|string[]} [tags]
     */
    constructor(id, entitySystem, tags) {
        super()

        this.sortableChildren = true

        this.id = id
        this.entitySystem = entitySystem
        this.components = []
        this.tags = Array.isArray(tags) ? [...tags] : [tags]

        this.shouldDespawn = false
    }

    close() {
        this.emit("close")

        for (const component of this.components) {
            component.close()
        }
    }

    despawn() {
        this.shouldDespawn = true
    }

    emit(name, ...args) {
        super.emit(name, this, ...args)
    }
    
    addComponent(name, options) {
        const Component = Components[name]

        if (!Component) {
            throw `Invalid component name "${name}"`
        }

        const len = this.components.push(new Component(this, options))
        this.components[len - 1].setName(name)
    }

    removeComponent(name) {
        // Todo
    }

    getComponent(name) {
        return this.components.find(c => c.name === name)   
    }

    ensureComponent(name) {
        const found = this.getComponent(name)

        if (!found) {
            throw `ensureComponent failed for "${name}"`
        }

        return found
    }

    hasComponent(name) {
        return this.components.some(c => c.name === name)
    }

    setupComponents() {
        for (const component of this.components) {
            component.setup()
        }
    }

    update(delta) {
        for (const component of this.components) {
            component.update(delta)
        }

        for (const component of this.components) {
            component.postUpdate()
        }
    }

    hasTag(tag) {
        return this.tags.includes(tag)
    }
}