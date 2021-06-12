import { IModule } from "game/scenes"
import { Rect, Vec2 } from "game/graphics"
import { TowerData, BulletData } from "game/data"
import { getTowerHeadEndPosition } from "game/ecs"
import { TowerEffects } from "game/graphics/effects"
import LevelLayers from "game/scenes/level/layers"
import { Container, Sprite } from "pixi.js"

export default class TowerManager extends IModule {
    static Name = "towerManager"

    setup() {
        this.container = new Container()
        this.scene.addChild(this.container, LevelLayers.TowerBase)

        game.on("build_tower", this.onBuildTower)
        game.on("remove_tower", this.onRemoveTower)
    }

    close() {
        this.scene.removeChild(this.container)

        game.removeListener("build_tower", this.onBuildTower)       
        game.removeListener("remove_tower", this.onRemoveTower)
    }

    onBuildTower = (event) => {
        const { pos, towerId } = event
        const { grid } = game.world

        if (!TowerData.hasOwnProperty(towerId)) {
            return console.error(`Failed to build tower - invalid towerId ${towerId}`)
        }

        const snapped = grid.snapPosToTile(pos)
        const texture = game.assets[TowerData[towerId].base.textureId]
        const bounds = new Rect(snapped.x + 1, snapped.y + 1, texture.width, texture.height)

        const tiles = grid.getTilesByBounds(bounds)

        if (!tiles || tiles.some(grid.isTileObstructed)) {
            console.warn("Can not build here", pos)
            return
        }

        grid.setTilesBlocked(tiles, true)

        const towerData = TowerData[towerId]
        // tiles[3].pos is basically center if tiles.length == 4.. I cheated a little, Todo :D 
        const components = this.getTowerComponents(towerData, tiles[3].pos)
        game.world.ecs.createEntity(components, "Tower")
    }
    
    onRemoveTower = (entityId) => {
        const entity = game.world.ecs.getEntity(entityId)
        const { transform, display } = entity.components
        const { width, height } = display.getLocalBounds()
        const { position } = transform

        const bounds = new Rect(position.x - width / 2, position.y - height / 2, width, height)
        const tiles = game.world.grid.getTilesByBounds(bounds)

        game.world.grid.setTilesBlocked(tiles, false)
        game.world.ecs.removeEntity(entityId)

        game.emit("tower_removed", entityId)
    }

    getTowerComponents(towerData, position) {
        const baseSprite = new Sprite(game.assets[towerData.base.textureId])
        const headSprite = new Sprite(game.assets[towerData.head.textureId])
        const container = new Container()

        container.addChild(baseSprite)
        container.addChild(headSprite)

        baseSprite.anchor.set(0.5, 0.5)
        headSprite.anchor.set(0.5, 0.2)

        this.scene.addChild(container, LevelLayers.TowerBase)

        return {
            "transform": { position },
            "display": { displayObject: container },
            "stats": { ...towerData.stats.base },
            "clickable": { onClick: (entity) => game.emit("tower_clicked", entity.id) },
            "tower": {
                headSprite,
                action: this.resolveTowerAction(towerData),
                actionEffect: this.resolveTowerEffect(towerData),
            },
        }
    }

    resolveTowerAction(towerData) {
        return (towerEntity) => {
            switch (towerData.action.type) {
                case "ShootBullet": this.shootBulletAction(towerEntity, towerData); break;
                case "DirectDamage": this.handleDamage(towerEntity, towerEntity.components.tower.target); break;
                default: throw new Error(`Unknown action type "${towerData.action.type}"`)
            }
        }
    }

    resolveTowerEffect(towerData) {
        if (towerData.action.effectId) {
            const effect = new TowerEffects[towerData.action.effectId]()
            this.scene.addChild(effect, LevelLayers.Beams)

            return effect
        }
    }

    shootBulletAction(towerEntity, towerData) {
        const { tower } = towerEntity.components

        const angle = tower.headSprite.rotation + Math.PI / 2
        const position = getTowerHeadEndPosition(towerEntity)

        const components = this.getBulletComponents({
            data: BulletData[towerData.action.bulletId],
            position,
            rotation: angle,
            range: tower.range,
            source: towerEntity
        })

        game.world.ecs.createEntity(components, "Bullet")
    }

    getBulletComponents({ data, position, rotation, range, source }) {
        const sprite = new Sprite(game.assets[data.textureId])
        const velocity = new Vec2(data.speed).velocity(rotation)

        sprite.anchor.set(0.5, 0.5)

        this.scene.addChild(sprite, LevelLayers.Bullets)

        return {
            "transform": { position, rotation },
            "velocity": { velocity },
            "display": { displayObject: sprite },
            "bullet": { source },
            "collideable": { 
                type: "active",
                solid: false,
                radius: sprite.width / 2,
                onCollision: (entity, target) => {
                    const { bullet } = entity.components
                    this.handleDamage(bullet.source, target)

                    entity.despawn()
                }
            },
            "travelLimit": {
                maxDistance: range * 1.5,
                onLimitReached: (entity) => entity.despawn()
            },
        }
    }

    handleDamage(source, target) {
        const sourceStats = source.components.stats
        const targetHealth = target.components.health

        targetHealth.current -= sourceStats.damage
    }
}
