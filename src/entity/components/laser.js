import utils from "game/utils"
import { Rect } from "game/graphics"
import { AdvancedBloomFilter } from "pixi-filters"
import { BLEND_MODES, Sprite } from "pixi.js"
import { Component } from "."

export default class LaserComponent extends Component {
    /**
     * 
     * @param {Entity}        entity 
     * @param {object}        options
     */
    constructor(entity, options) {
        super(entity)
        
        this.options = {
            layer: null,
            ...options,
        }
    }

    setup() {
        this.tower = this.entity.getComponent("tower")

        // Todo:shader: When we get our filters running, this can be replaced
        //              (there's a bug with this, the first laser places has incorrect pivot.x)
        this.sprite = new Sprite(utils.createRectTexture(new Rect(0, 0, 4, 1), 0xffffff))
        this.sprite.scale.x = 0.5
        this.sprite.pivot.x = Math.round(this.sprite.width / (2 * this.sprite.scale.x))
        this.sprite.tint = 0xff1800
        this.sprite.visible = false
        this.sprite.blendMode = BLEND_MODES.ADD

        const bloom = new AdvancedBloomFilter({
            threshold: 0,
            bloomScale: 2,
            brightness: 2,
            blur: 2,
        })

        bloom.padding = 10 // otherwise the filter is cut off at texture edge
        this.sprite.filters = [bloom]

        this.options.layer.addChild(this.sprite)
    }

    close() {
        this.options.layer.removeChild(this.sprite)
    }

    setFromTo(from, to) {
        this.sprite.position.copyFrom(from)
        this.sprite.height = from.distance(to)
        this.sprite.rotation = from.angle(to) - Math.PI / 2
    }

    setVisible(state) {
        this.sprite.visible = state
    }
}
