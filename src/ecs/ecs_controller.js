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

        if (components) {
            for (const [cmpName, cmpProps] of Object.entries(components)) {
                if (!Components.hasOwnProperty(cmpName)) {
                    throw new Error(`Invalid entity component name "${cmpName}"`)
                }

                entity.addComponent(cmpName, Components[cmpName](cmpProps, entity))
            }
        }
        
        this.entities.push(entity)

        for (const system of this.systems) {
            if (entity.hasComponents(system.constructor.Dependencies)) {
                system.setupComponents(entity)
            }
        }

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

    getEntity(entityId) {
        return this.entities.find(entity => entity.id === entityId)
    }
}
