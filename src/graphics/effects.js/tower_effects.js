import { getTowerHeadEndPosition } from "game/ecs";
import { AdvancedBloomFilter } from "pixi-filters";
import { BLEND_MODES, Container, Sprite } from "pixi.js";

/**
 * @abstract
 */
class ActionEffect extends Container {
    /**
     * @abstract
     */
    update(delta, entity) {}

    /**
     * @abstract
     */
    stop() {}
}

class TowerBeamEffect extends ActionEffect {
    constructor() {
        super()

        this.sprite = new Sprite(game.assets["BeamBase"])
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

    update(delta, entity) {
        const { tower } = entity.components

        if (tower.target) {
            const fromPos = getTowerHeadEndPosition(entity)
            const targetPos = tower.target.components.transform.position

            this.sprite.visible = true
            this.sprite.position.copyFrom(fromPos)
            this.sprite.height = fromPos.distance(targetPos)
            this.sprite.rotation = tower.headSprite.rotation

            // this.sprite.rotation = fromPos.angle(targetPos) - Math.PI / 2
        }
        else {
            this.sprite.visible = false
        }
    }
}

export default {
    "BeamEffect": TowerBeamEffect
}
