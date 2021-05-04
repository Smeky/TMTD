import Components from "./components"
import { Container } from "pixi.js"

export default class Entity extends Container {
    /**
     * 
     * @param {*} id 
     * @param {Entities[]} entities 
     * @param {string|string[]} [tags]
     */
    constructor(id, entities, tags) {
        super()

        this.sortableChildren = true

        this.id = id
        this.entities = entities
        this.components = []
        this.tags = Array.isArray(tags) ? [...tags] : [tags]

        this.willBeRemoved = false
    }

    close() {
        this.emit("close")

        for (const component of this.components) {
            component.close()
        }
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