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
     * @param {string} [tag] 
     */
    createEntity(components, tag) {
        const entity = new Entity(++this.idCounter, this, tag)
        
        for (const [name, options] of Object.entries(components)) {
            entity.addComponent(name, options)
        }

        this.addChild(entity)
        entity.setupComponents()

        return entity
    }

    removeEntity(id) {
        const entity = this.children.find(e => e.id === id)

        if (!entity) {
            throw "Invalid entity id"
        }

        entity.emit("close")
        entity.close()

        this.removeChild(entity)
    }

    getEntity(id) {
        return this.children.find(e => e.id === id)
    }

    update(delta) {
        for (const entity of this.children) {
            entity.update(delta)
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
