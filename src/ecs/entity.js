
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

    hasComponent(name) {
        return this.components.hasOwnProperty(name)
    }

    hasComponents(names) {
        return names.every(name => this.hasComponent(name))
    }
}
