import { Rect } from "game/graphics"
import { Component } from "."
import { filterEntitiesByComponent, filterEntitiesByTags } from "../entity_system"

export default class CollideableComponent extends Component {
    constructor(entity, options) {
        super(entity)

        this.radius = options.radius ?? 0
        this.static = options.static ?? true
        this.ignoreTags = options.ignoreTags || []
        this.onHit = options.onHit

        if (this.radius <= 0) {
            console.warn(`CollideableComponent component with radius=${radius} will not work`)
        }
    }

    setup() {
        this.transform = this.entity.ensureComponent("transform")
    }

    update(delta) {
        if (!this.static) {
            let entities = this.entity.entitySystem.getEntities()

            entities = entities.filter(e => e.id !== this.entity.id)
            entities = entities.filter(filterEntitiesByComponent("collideable"))
            entities = entities.filter(e => !this.ignoreTags.some(tag => e.tags.includes(tag)))
            
            if (entities.length > 0) {
                const [myCenter, _] = this.getEntityCenterAndRadius(this.entity)

                entities = entities.filter((entity) => {
                    const [otherCenter, otherRadius] = this.getEntityCenterAndRadius(entity)

                    return myCenter.distance(otherCenter) < this.radius + otherRadius
                })

                if (entities.length > 0 && this.onHit) {
                    this.onHit(this.entity, entities[0])
                }
            }
        }
    }

    getEntityCenterAndRadius(entity) {
        const { width, height } = entity.getLocalBounds()
        const position = entity.getComponent("transform").pos
        const radius = entity.getComponent("collideable").radius

        return [new Rect(position.x, position.y, width, height).center(), radius]
    }
}