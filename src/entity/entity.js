import Components from "./components"
import { Container } from "pixi.js"

export default class Entity extends Container {
    constructor(id, entities) {
        super()

        this.sortableChildren = true

        this.id = id
        this.entities = entities
        this.components = []
    }

    close() {
        for (const component of this.components) {
            component.close()
        }
    }
    
    addComponent(name, options) {
        this.components.push(new Components[name](this, options))
    }

    removeComponent(name) {
        // Todo
    }

    getComponent(name) {
        return this.components.find(c => c.name === name)   
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
}