import { includesAllOf, intersects } from "game/utils"
import { Components, Systems, Entity } from "."

export default class ECSController {
    constructor() {
        this.idCounter = 0
        this.entities = []
        this.systems = Systems.map(System => new System())
    }

    update(delta) {
        for (const system of this.systems) {
            for (const entity of this.entities) {
                if (entity.shouldDespawn) {
                    this.removeEntity(entity.id, true)
                }

                if (entity.hasComponents(system.constructor.Dependencies)) {
                    system.updateEntity(delta, entity, this.entities)
                }
            }
        }
    }

    createEntity(components, tags) {
        const entity = new Entity(++this.idCounter, tags)

        this.addEntityComponents(entity, components)
        
        this.entities.push(entity)
        return entity
    }

    /**
     * 
     * @param {*} id entity id
     * @param {bool} force whether entity should be removed immediately (can have side effects) or before next update
     */
    removeEntity(entityId, force = false) {
        const index = this.entities.findIndex(entity => entity.id === entityId)

        if (index < 0) {
            throw new Error(`Failed to remove entity - invalid entityId "${entityId}"`)
        }

        const entity = this.entities[index]
        
        if (!force) {
            entity.despawn()
        }
        else {
            for (const system of this.systems) {
                if (entity.hasComponents(system.constructor.Dependencies)) {
                    system.closeComponents(entity)
                }
            }

            this.entities.splice(index, 1)
        }
    }

    /**
     * 
     * @param {Entity} entity 
     * @param {Object} components 
     */
    addEntityComponents(entity, components) {
        const cmpNames = Object.keys(components)

        if (!cmpNames.length) {
            return
        }

        for (const name of cmpNames) {
            if (!Components.hasOwnProperty(name)) {
                throw new Error(`Invalid entity component name "${name}"`)
            }

            const props = components[name]
            entity.components[name] = Components[name](props, entity)
        }

        for (const system of this.systems) {
            if (includesAllOf(system.constructor.Dependencies, cmpNames)) {
                system.setupComponents(entity)
            }
        }
    }

    /**
     * @param {Entity} entity
     * @param {...string} names 
     */
    removeEntityComponents(entity, ...names) {
        for (const system of this.systems) {
            for (const name of names) {
                if (entity.hasComponent(name) &&
                    system.constructor.Dependencies.includes(name)) 
                {
                    system.closeComponents(entity)
                }
            }
        }
    }

    getEntity(entityId) {
        return this.entities.find(entity => entity.id === entityId)
    }
}
