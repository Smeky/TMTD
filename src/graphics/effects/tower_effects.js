import { Game } from "game/";
import { AdvancedBloomFilter } from "pixi-filters";
import { BLEND_MODES, Container, Sprite } from "pixi.js";

class ActionEffect extends Container {
    start(entity) {}
    stop(entity) {}

    /**
     * @abstract
     */
    update(delta, entity) {}
}

class TowerBeamEffect extends ActionEffect {
    constructor() {
        super()

        this.sprite = new Sprite(Game.assets["BeamBase"])
        this.addChild(this.sprite)

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
    }

    start() {
        this.sprite.visible = true
    }

    stop() {
        this.sprite.visible = false
    }

    update(delta, entity) {
        if (this.sprite.visible) {
            const { towerSkill, transform } = entity.components
    
            if (towerSkill.target) {
                const targetPos = towerSkill.target.components.transform.position
    
                this.sprite.position.copyFrom(transform.position)
                this.sprite.height = transform.position.distance(targetPos)
                this.sprite.rotation = transform.position.angle(targetPos) - Math.PI / 2
            }
        }
    }
}

export default {
    "BeamEffect": TowerBeamEffect
}
