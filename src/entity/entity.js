import { Components } from "./components"
import { Container } from "pixi.js"
import { EntitySystem } from "."
import { intersection, intersects } from "game/utils"

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
        this.shouldDespawn = false

        this.id = id
        this.entitySystem = entitySystem
        this.tags = Array.isArray(tags) ? [...tags] : [tags]
        this.components = []
    }

    close() {
        this.emit("is_closing")

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

    getOtherEntities() {
        const filter = (entity) => entity.id !== this.id
        return this.entitySystem.getEntities().filter(filter)
    }

    /* ------------------------------------------------------ */
    /*                  Component Management                  */
    /* ------------------------------------------------------ */
    
    addComponent(name, options) {
        const Component = Components[name]

        if (!Component) {
            throw new Error(`Invalid component name "${name}"`)
        }

        this.components.push(new Component(this, options))
    }

    removeComponent(name) {
        // Todo
    }

    getComponent(name) { 
        return this.components.find(cmp => cmp.constructor.ComponentName === name) 
    }
    // It's important to return components in the same order as the names array
    getComponents(names) { 
        return names.map(name => this.getComponent(name)) 
    }

    ensureComponent(name) {
        const found = this.getComponent(name)

        if (!found) {
            throw `ensureComponent failed for "${name}"`
        }

        return found
    }

    hasComponent(name) {
        return this.components.some(cmp => cmp.constructor.ComponentName === name)
    }

    setupComponents() {
        for (const component of this.components) {
            this.setupComponentDependencies(component)
            component.setup()
        }
    }

    setupComponentDependencies(component) {
        const dependencies = component.constructor.Dependencies
        if (!dependencies) return

        let requiredCmps = dependencies.required ? this.getComponents(dependencies.required) : []
        let optionalCmps = dependencies.optional ? this.getComponents(dependencies.optional) : []

        optionalCmps = optionalCmps.filter(cmp => !!cmp)
        requiredCmps.forEach((cmp, index) => {
            if (!cmp) {
                throw new Error(`Missing component dependency "${dependencies.required[index]}" for "${component.constructor.ComponentName}"`)
            }
        })

        const dependencyRefs = [...requiredCmps, ...optionalCmps].reduce((acc, cmp) => {
            acc[cmp.constructor.ComponentName] = cmp
            return acc
        }, {})

        component.setDependencyComponents(dependencyRefs)
    }
}