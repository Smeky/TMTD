import { Container } from "pixi.js"
import { Entity } from "."

export default class Entities extends Container {
    constructor() {
        super()

        this.idCounter = 0 // Todo:id: Replace me
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

        this.addChild(entity)
        entity.setupComponents()
        entity.interactive = true
        entity.on("click", () => game.emit("entity_clicked", entity.id))

        return entity
    }

    /**
     * 
     * @param {*} id entity id
     * @param {bool} force whether entity should be removed immediately (can have side effects) or before next update
     */
    removeEntity(id, force = false) {
        const entity = this.children.find(e => e.id === id)

        if (!entity) throw "Invalid entity id"
        
        if (!force) {
            entity.willBeRemoved = true
        }
        else {
            entity.emit("close")
            entity.close()

            this.removeChild(entity)
        }
    }

    getEntityById(id) {
        return this.children.find(e => e.id === id)
    }

    /**
     * 
     * @param {string|string[]} tags
     */
    getEntitiesByTags(tags) {
        const _tags = Array.isArray(tags) ? [...tags] : [tags]

        return this.children.filter((entity) => {
            return _tags.some(tag => entity.tags.includes(tag))
        })
    }

    update(delta) {
        for (const entity of this.children) {
            if (entity.willBeRemoved) {
                this.removeEntity(entity.id, true)
            }
            else {
                entity.update(delta)
            }
        }
    }

    count() {
        return this.children.length
    }

    /**
     * 
     * @param {Vec2} pos 
     * @param {number} radius radius in pixels 
     * @param {string} [tag] [optional] also filter by the tag
     */
    getEntitiesInRadius(pos, radius, tag) {
        return this.children.filter((entity) => {
            if (tag && !entity.hasTag(tag)) {
                return
            }
            
            const transform = entity.getComponent("transform")
    
            if (transform) {
                return transform.pos.distance(pos) <= radius
            }

            return false
        })
    }
}
