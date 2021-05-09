import { Vec2 } from "game/graphics"
import { DisplayObject, Sprite } from "pixi.js"
import { Component } from "."

export default class TowerComponent extends Component {
    /**
     * 
     * @param {Entity}        entity 
     * @param {object}        options
     * @param {object}        options.data
     * @param {DisplayObject} [options.parent] Parent for head part of the tower. Usually a layer above entities. Defaults to this.entity
     */
    constructor(entity, options) {
        super(entity) 

        this.base = options.base
        this.head = options.head

        const { width, height } = this.base.texture
        this.size = new Vec2(width, height)

        this.data = options.data
        this.level = 1

        this.setupSprites()
    }

    setupSprites() {
        const { texture, pivot } = this.head

        this.baseSprite = new Sprite(this.base.texture)
        
        this.headSprite = new Sprite(texture)
        this.headSprite.pivot.copyFrom(pivot)
        this.headSprite.zIndex = 5

        this.entity.addChild(this.baseSprite)
        this.entity.addChild(this.headSprite)
    }

    setup() {
        const transform = this.entity.ensureComponent("transform")

        this.baseSprite.position.copyFrom(transform.pos)

        const posOnTower = this.head.pos.multiply(this.size)
        this.headSprite.x = transform.pos.x + posOnTower.x
        this.headSprite.y = transform.pos.y + posOnTower.y
    }

    close() {
        this.entity.removeChild(this.baseSprite)
        this.entity.removeChild(this.headSprite)
    }

    update(delta) {

    }

    setHeadRotation(angle) {
        this.headSprite.rotation = angle - Math.PI / 2
    }

    getHeadRotation() {
        return this.headSprite.rotation + Math.PI / 2
    }

    getHeadEndPosition() {
        const offset = this.headSprite.height - this.headSprite.pivot.y
        const angle = this.getHeadRotation()

        return new Vec2(
            this.headSprite.x + Math.cos(angle) * offset,
            this.headSprite.y + Math.sin(angle) * offset,
        )
    }
    
    setLevel(level) {
        this.level = level
        this.headSprite.tint = 0xffffff - Math.min((0x001515 * level), 0x00ffff)
    }
}
