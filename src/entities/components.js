import * as pixi from "pixi.js"
import { Vec2 } from "../core/structs"
import utils from "../utils"

class Component {
    name = null

    constructor() {
        this.entity = null
    }

    init() {}
    update(delta) {}
}

/**
 * API IDEA:
 * 
 *  Entity.components[component.name] = component --,   (objects)
 *  entity.components.transform.pos.x    <----------|
 * 
 *  (If objects would be slow, we could try to use dynamicly named getters for 
 *   each component. Those would be greated as we add components. Not sure if it's doable)
 * 
 *  const component = entity.addComponent(name) @returns new component
 *  const component = entity.components.myComponentName @returns the new comp from line above
 * 
 *  entity.init()
 *  entity.update()
 *  entity.sync()       (if component.needSync = true)
 */

// Todo:component: This should be Sprite but something like "Display" - as anything that's
//                 renderable. Sprite should be somehow added in (need to figure out a nice way)
export class SpriteComponent extends Component {
    name = "sprite"

    constructor(...args) {
        super()

        this.sprite = new pixi.Sprite(...args)
        this.transform = undefined // TransformComponent
    }

    init() {
        this.entity.addChild(this.sprite)
        
        this.transform = this.entity.getComponent("transform")
        
        if (this.transform) {
            this.updateTransform()
        }
    }

    update(delta) {
        if (this.transform) {
            this.updateTransform()
        }
    }

    updateTransform() {
        this.sprite.x = this.transform.pos.x
        this.sprite.y = this.transform.pos.y
    }
}

export class TransformComponent extends Component {
    name = "transform"

    constructor(pos = new Vec2()) {
        super()
        this.pos = pos
    }
}

export class MovementComponent extends Component {
    name = "movement"

    constructor(opts = {velocity: 0}) {
        super()
        this.transform = null
        this.velocity = opts.velocity
        
        this.destinations = []
    }

    init() {
        this.transform = this.entity.getComponent("transform")

        if (!this.transform) {
            throw "Entity is missing transform component"
        }

        if (this.destinations.length) {
            this.debug = game.debug.drawPoint(this.destinations[0])
        }
    }

    update(delta) {
        if (this.destinations.length === 0) {
            return
        }

        if (this.transform.pos.distance(this.destinations[0]) < this.velocity * delta) {
            this.transform.pos = this.destinations.shift()

            if (this.destinations.length === 0) {
                return
            }
            else {
                this.debug = game.debug.drawPoint(this.destinations[0])
            }
        }
        else {
            const angle = this.transform.pos.angle(this.destinations[0])
            const x = this.velocity * Math.cos(angle)
            const y = this.velocity * Math.sin(angle)
    
            this.transform.pos.x += x * delta
            this.transform.pos.y += y * delta

            this.prevAngle = angle
        }
    }

    moveTo(dest) {
        this.destinations.push(dest)

        // game.debug.displayBounds(game.debug)
        // game.debug.toggleCenterRuler()
    }
}