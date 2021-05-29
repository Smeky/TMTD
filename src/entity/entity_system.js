import { Entity } from "."

export default class EntitySystem {
    constructor() {
        this.idCounter = 0 // Todo:id: Replace me
        this.entities = []
    }

    /**
     * 
     * @param {object} components 
     * @param {string|string[]} [tags] 
     */
    createEntity(components, tags) {
        const entity = new Entity(++this.idCounter, this, tags)
        
        for (const [name, options] of Object.entries(components)) {
            entity.addComponent(name, options)
        }

        entity.setupComponents()

        this.entities.push(entity)

        return entity
    }

    /**
     * 
     * @param {*} id entity id
     * @param {bool} force whether entity should be removed immediately (can have side effects) or before next update
     */
    removeEntity(id, force = false) {
        const index = this.entities.findIndex(e => e.id === id)
        if (index < 0) throw "Invalid entity id"

        const entity = this.entities[index]
        
        if (!force) {
            entity.despawn()
        }
        else {
            entity.close()
            this.entities.splice(index, 1)
        }
    }

    getEntityById(id) {
        return this.entities.find(e => e.id === id)
    }

    /**
     * 
     * @param {string|string[]} tags
     */
    getEntitiesByTags(tags) {
        const _tags = Array.isArray(tags) ? [...tags] : [tags]

        return this.entities.filter((entity) => {
            return _tags.some(tag => entity.tags.includes(tag))
        })
    }

    update(delta) {
        for (const entity of this.entities) {
            if (entity.shouldDespawn) {
                this.removeEntity(entity.id, true)
            }
            else {
                entity.update(delta)
            }
        }
    }

    clear() {
        for (const entity of this.entities) {
            entity.close()
        }

        this.entities = []
    }

    count() {
        return this.entities.length
    }

    getEntities() {
        return this.entities
    }

    /**
     * 
     * @param {Vec2} pos 
     * @param {number} radius radius in pixels 
     * @param {string} [tag] [optional] also filter by the tag
     */
    getEntitiesInRadius(pos, radius, tag) {
        return this.entities.filter((entity) => {
            if (tag && !entity.hasTag(tag)) {
                return false
            }
            
            const { width, height } = entity.getLocalBounds()
            const transform = entity.getComponent("transform")
    
            if (transform) {
                const relative = pos.subtract(transform.position)

                return transform.position.distance(pos) <= radius
            }

            return false
        })
    }
}

export function filterEntitiesByTags(tags) {
    tags = Array.isArray(tags) ? [...tags] : [tags]
    return (entity) => tags.some((tag) => entity.hasTag(tag))
}

export function filterEntitiesByComponent(name) {
    return (entity) => entity.hasComponent(name)
}
