import { Vec2 } from "game/graphics"
import { Cooldown } from "game/core"
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
        this.laserLayer = options.laserParent

        this.transform = null
        this.target = null

        this.level = 1

        this.setupHeadDisplay()

        {   // Setup damage
            const { rate, damage } = this.data.head.attack

            this.damage = damage
            this.cooldown = new Cooldown(rate || 1.0)
            this.cooldown.onTrigger = this.handleAttack
        }
    }

    setup() {
        this.transform = this.entity.getComponent("transform")
        this.laser = this.entity.getComponent("laser")
        const display = this.entity.getComponent("display")

        // Todo: We need something.. prettier
        if (!this.transform) {
            throw "Requires Transform component"
        }
        if (!display) {
            throw "Requires Display component"
        }

        const { size } = this.data
        const { texture } = this.data.base
        
        display.setDisplayObject(new Sprite(texture))

        const posOnTower = this.data.head.pos.multiply(size)
        this.headSprite.x = this.transform.pos.x + posOnTower.x
        this.headSprite.y = this.transform.pos.y + posOnTower.y
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
        if (!this.target) {
            this.findTarget()
        }

        if (this.cooldown.update(delta) && this.target) {
            this.cooldown.reset()

            const health = this.target.getComponent("health")

            // Temporary 
            if (health.isAlive() && health.reduce(this.damage)) {
                game.emit("target_killed", { towerId: this.entity.id, targetId: this.target.id })
                this.clearTarget()
            }
        }

        this.updateHeadDisplay()
    }

    findTarget() {
        const { range } = this.data.head.attack

        const entities = this.entity.entities.getEntitiesInRadius(this.transform.pos, range, "enemy")
        const closest = entities.reduce((winner, entity) => {
            const distance = this.transform.pos.distance(entity.getComponent("transform").pos)

            if (!winner.entity) {
                winner.entity = entity
                winner.distance = distance
            }
            else {
                if (distance < winner.distance) {
                    winner.entity = entity
                    winner.distance = distance
                }
            }

            return winner
        }, { entity: null, distance: null })

        if (closest.entity) {
            this.target = closest.entity
            this.target.on("close", this.clearTarget)

            this.laser.setVisible(true)
            this.updateHeadDisplay()
        }
    }

    clearTarget = () => {
        this.target = null
        this.laser.setVisible(false)

        if (this.debug) {
            this.debug.destroy()
        }
    }

    updateHeadDisplay() {
        if (!this.target) {
            return
        }

        const targetPos = this.target.getComponent("transform").pos
        const center = this.transform.pos.add(this.data.size.divide(2))
        const angle = center.angle(targetPos)
        
        const radius = this.headSprite.height - this.headSprite.pivot.y
        const fromPos = new Vec2(
            this.headSprite.x + Math.cos(angle) * radius,
            this.headSprite.y + Math.sin(angle) * radius,
        )

        this.headSprite.rotation = angle - Math.PI / 2
        this.laser.setFromTo(fromPos, targetPos, angle)
    }
}
