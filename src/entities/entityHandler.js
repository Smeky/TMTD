import * as pixi from "pixi.js"

class Entity extends pixi.Container {
    constructor(id) {
        super()

        this.id = id
        this.components = []
    }

    addComponent(component) {
        component.entity = this
        this.components.push(component)
        return component // just for better syntax
    }

    removeComponent(name) {
        this.components = this.components.filter(component => component.name === name)
    }

    getComponent(name) {
        return this.components.find(component => component.name === name)
    }

    init() {
        this.components.forEach(component => component.init())
    }

    update(delta) {
        this.components.forEach(component => component.update(delta))
    }
}

export default class EntityHandler {
    constructor() {
        this.entities = []
        this.idCounter = 0 // Todo:id: replace me
    }

    createEntity() {
        this.entities.push(new Entity(++this.idCounter))
        return this.entities[this.entities.length - 1]
    }

    removeEntity(id) {
        this.entities = this.entities.filter(entity => entity.id === id)
    }

    update(delta) {
        this.entities.forEach(entity => entity.update(delta))
    }
}