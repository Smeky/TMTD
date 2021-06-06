
export default class Entity {
    constructor(id, tags) {
        this.id = id
        this.tags = Array.isArray(tags) ? [...tags] : [tags]
        this.components = {}

        this.shouldDespawn = false
    }

    despawn() {
        this.shouldDespawn = true
    }

    isActive() { 
        return !this.shouldDespawn 
    }

    addComponent(name, component) {
        this.components[name] = component
    }

    getComponent(name) { 
        return this.components[name]
    }
    // It's important to return components in the same order as the names array
    getComponents(names) { 
        return names.map(name => this.getComponent(name)) 
    }

    hasComponent(name) {
        return this.components.hasOwnProperty(name)
    }

    hasComponents(names) {
        return names.every(name => this.hasComponent(name))
    }
}
