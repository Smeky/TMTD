import { Vec2 } from "game/graphics"
import { DisplayObject } from "pixi.js"
import { Component } from "."

export default class TowerComponent extends Component {
    static ComponentName = "Tower"
    static Dependencies = { required: ["Transform", "Stats"] }

    /**
     * 
     * @param {Entity}        entity 
     * @param {object}        options
     * @param {object}        options.data
     * @param {DisplayObject} [options.parent] Parent for head part of the tower. Usually a layer above entities. Defaults to this.entity
     */
    constructor(entity, options) {
        super(entity) 

        this.parent = options.parent || this.entity
        this.perLevelStatsMultipliers = options.perLevelStatsMultipliers || {}
        this.headPosition = options.headPosition || new Vec2(0.5, 0.5)
        
        this.baseSprite = options.baseSprite
        this.headSprite = options.headSprite
        this.headSprite.zIndex = 5

        if ("headPivot" in options) {
            this.headSprite.pivot.copyFrom(options.headPivot)
        }

        this.parent.addChild(this.baseSprite)
        this.parent.addChild(this.headSprite)
        
        const { width, height } = this.baseSprite.getLocalBounds()
        this.size = new Vec2(width, height)

        this.data = options.data
        this.level = 1
    }

    setup() {
        const cmpTransform = this.dependencies.Transform

        this.baseSprite.position.copyFrom(cmpTransform.position)

        const posOnTower = this.headPosition.multiply(this.size)
        this.headSprite.x = cmpTransform.position.x + posOnTower.x
        this.headSprite.y = cmpTransform.position.y + posOnTower.y
    }

    close() {
        this.parent.removeChild(this.baseSprite)
        this.parent.removeChild(this.headSprite)
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

        const { Stats: cmpStats } = this.dependencies
        for (const [statKey, multiplier] of Object.entries(this.perLevelStatsMultipliers)) {
            cmpStats.current[statKey] = cmpStats.base[statKey] * (multiplier ** this.level)
        }
    }
}
