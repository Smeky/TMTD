import * as pixi from "pixi.js"
import { Vec2 } from "../core/structs"

class Component {
    name = null

    constructor() {
        this.entity = null
    }

    init() {}
    update(delta) {}
}

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
    }

    update(delta) {
        if (this.transform) {
            this.sprite.x = this.transform.pos.x
            this.sprite.y = this.transform.pos.y
        }
    }
}

export class TransformComponent extends Component {
    name = "transform"

    constructor(pos = new Vec2()) {
        super()
        this.pos = pos
    }
}