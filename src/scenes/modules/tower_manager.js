import { IModule } from "game/scenes"
import { Rect, Vec2 } from "game/graphics"
import { TowerData, BulletData } from "game/data"
import { getTowerHeadEndPosition } from "game/ecs"
import { TowerEffects } from "game/graphics/effects"
import LevelLayers from "game/scenes/level/layers"
import { Container, Sprite } from "pixi.js"
import { Game } from "game/"

export default class TowerManager extends IModule {
    setup() {
        this.container = new Container()
        Game.world.addChild(this.container, LevelLayers.TowerBase)

        Game.on("build_tower", this.onBuildTower)
        Game.on("remove_tower", this.onRemoveTower)
    }

    close() {
        Game.world.removeChild(this.container)

        Game.removeListener("build_tower", this.onBuildTower)       
        Game.removeListener("remove_tower", this.onRemoveTower)
    }

    onBuildTower = (event) => {
        const { pos, towerId } = event
        const { grid } = Game.world

        if (!TowerData.hasOwnProperty(towerId)) {
            return console.error(`Failed to build tower - invalid towerId ${towerId}`)
        }

        const snapped = grid.snapPosToTile(pos)
        const texture = Game.assets[TowerData[towerId].textureId]
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
        Game.world.ecs.createEntity(components, "Tower")
    }

    onRemoveTower = (entityId) => {
        const entity = Game.world.ecs.getEntity(entityId)
        const { transform, display } = entity.components
        const { width, height } = display.getLocalBounds()
        const { position } = transform

        const bounds = new Rect(position.x - width / 2, position.y - height / 2, width, height)
        const tiles = Game.world.grid.getTilesByBounds(bounds)

        Game.world.grid.setTilesBlocked(tiles, false)
        Game.world.ecs.removeEntity(entityId)

        Game.emit("tower_removed", entityId)
    }

    getTowerComponents(towerData, position) {
        const baseSprite = new Sprite(Game.assets[towerData.textureId])
        baseSprite.anchor.set(0.5, 0.5)

        const container = new Container()
        container.addChild(baseSprite)

        Game.world.addChild(container, LevelLayers.TowerBase)

        return {
            "transform": { position },
            "display": { displayObject: container },
            "stats": { ...towerData.stats.base },
            "clickable": { onClick: (entity) => Game.emit("tower_clicked", entity.id) },
            "socketable": {},
            "tower": {},
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
            Game.world.addChild(effect, LevelLayers.Beams)

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

        Game.world.ecs.createEntity(components, "Bullet")
    }

    getBulletComponents({ data, position, rotation, range, source }) {
        const sprite = new Sprite(Game.assets[data.textureId])
        const velocity = new Vec2(data.speed).velocity(rotation)

        sprite.anchor.set(0.5, 0.5)

        Game.world.addChild(sprite, LevelLayers.Bullets)

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

    handleDragDrop = (item) => {
        console.log("handleDragDrop", item)
    }
}
