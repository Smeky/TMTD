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

        this.data = options.data
        this.parent = options.parent || this.entity

        this.level = 1

        this.setupHeadDisplay()
    }

    setup() {
        const display = this.entity.ensureComponent("display")
        const transform = this.entity.ensureComponent("transform")

        const { size } = this.data
        const { texture } = this.data.base

        display.setDisplayObject(new Sprite(texture))

        const posOnTower = this.data.head.pos.multiply(size)
        this.headSprite.x = transform.pos.x + posOnTower.x
        this.headSprite.y = transform.pos.y + posOnTower.y
    }

    setupHeadDisplay() {
        const { texture, pivot } = this.data.head

        this.headSprite = new Sprite(texture)
        this.headSprite.pivot.copyFrom(pivot)
        this.headSprite.zIndex = 5
        
        this.parent.addChild(this.headSprite)
    }

    close() {
        this.parent.removeChild(this.headSprite)
    }

    update(delta) {

    }

    setHeadRotation(angle) {
        this.headSprite.rotation = angle - Math.PI / 2
    }
}
