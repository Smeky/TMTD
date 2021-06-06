import { IModule } from "game/scenes"
import { Rect, Vec2 } from "game/graphics"
// import { Tile } from "game/core"
import { TowerData, BulletData } from "game/data"
import { Container, Sprite } from "pixi.js"
import { TowerEffects } from "game/graphics/effects.js"
import { getTowerHeadEndPosition } from "game/ecs"

const TowerSize = 50    // Todo: get rid of me, please

export default class TowerManager extends IModule {
    static Name = "towerManager"

    setup() {
        this.container = new Container()
        this.scene.addChild(this.container, this.scene.Layers.TowerBase)

        game.on("build_tower", this.onBuildTower)
        game.on("upgrade_tower", this.onUpgradeTower)
        game.on("remove_tower", this.onRemoveTower)
    }

    close() {
        this.scene.removeChild(this.container)

        game.removeListener("build_tower", this.onBuildTower)       
        game.removeListener("upgrade_tower", this.onUpgradeTower)
        game.removeListener("remove_tower", this.onRemoveTower)
    }

    onBuildTower = (event) => {
        const { pos, towerId } = event
        const { grid } = this.scene

        if (!TowerData.hasOwnProperty(towerId)) {
            return console.error(`Failed to build tower - invalid towerId ${towerId}`)
        }

        const snapped = grid.snapPosToTile(pos)
        const bounds = new Rect(snapped.x + 1, snapped.y + 1, TowerSize, TowerSize)

        const tiles = grid.getTilesByBounds(bounds)
                               .filter(tile => !grid.isTileObstructed(tile))

        if (tiles.length < 4) {
            console.warn("Can not build here", pos)
            return
        }

        grid.setTilesBlocked(tiles, true)

        // const topLeft = grid.getTopLeftTile(tiles).pos
        const towerData = TowerData[towerId]

         // tiles[3].pos is basically center if tiles.length == 4.. I cheated a little, Todo :D 
        const components = this.getTowerComponents(towerData, tiles[3].pos)
        this.scene.ecs.createEntity(components, "Tower")

        // const components = this.getTowerComponents(towerData, topLeft.add(Tile.Size - TowerSize / 2))

        // try {
            // const entity = this.scene.entitySystem.createEntity(components, "tower")
            // this.container.addChild(entity)

            // game.emit("tower_built")
        // }
        // catch (e) {
        //     return console.error(e)
        // }
    }

    onUpgradeTower = (entityId) => {
        const entity = this.scene.entitySystem.getEntityById(entityId)

        if (entity) {
            const cmpTower = entity.getComponent("Tower")
            const cmpStats = entity.getComponent("Stats")
            
            const basePrice = 20    // Todo: handle purchases / currency manipulation elsewhere
            const price = cmpTower.level
            // const price = Math.round((cmpTower.level * basePrice) * 0.9)
            const currency = this.scene.currency

            if (currency() >= price) {
                currency(currency() - price)

                cmpTower.setLevel(cmpTower.level + 1)
                cmpStats.current.damage += 1
    
                game.emit("tower_upgraded", entityId)
            }
            else {
                console.warn(`not enough currency! (price: ${price})`)
            }
        }
        else {
            throw new Error(`Unable to find entity (tower) id: ${entityId} for upgrade`)
        }
    }

    onRemoveTower = (entityId) => {
        const entity = this.scene.entitySystem.getEntityById(entityId)

        const pos = entity.getComponent("Transform").position
        const snapped = this.scene.grid.snapPosToTile(pos)
        const bounds = new Rect(snapped.x + 1, snapped.y + 1, TowerSize, TowerSize)
        const tiles = this.scene.grid.getTilesByBounds(bounds)

        this.scene.grid.setTilesBlocked(tiles, false)
        this.scene.entitySystem.removeEntity(entity.id)

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

        this.scene.addChild(container, this.scene.Layers.TowerBase)

        return {
            "transform": { position },
            "display": { displayObject: container },
            "stats": { ...towerData.stats.base },
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
            this.scene.addChild(effect, this.scene.Layers.Beams)

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

        this.scene.ecs.createEntity(components, "Bullet")
    }

    getBulletComponents({ data, position, rotation, range, source }) {
        const sprite = new Sprite(game.assets[data.textureId])
        const velocity = new Vec2(data.speed).velocity(rotation)

        sprite.anchor.set(0.5, 0.5)

        this.scene.addChild(sprite, this.scene.Layers.Bullets)

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


    
    // getTowerComponents(towerData, position) {
    //     const components = {
    //         "Transform": {
    //             position
    //         },
    //         "Tower": {
    //             baseSprite: new Sprite(game.assets[towerData.base.textureId]),
    //             headSprite: new Sprite(game.assets[towerData.head.textureId]),
    //             headPosition: towerData.head.position,
    //             headPivot: towerData.head.pivot,
    //             perLevelStatsMultipliers: towerData.stats.perLevelMultiplier
    //         },
    //         "Stats": {
    //             ...towerData.stats.base
    //         },
    //         "OnClick": {
    //             onClick: (entity) => { game.emit("tower_clicked", entity.id) }
    //         },
    //     }

    //     const bulletContainer = this.scene.getLayer(this.scene.Layers.Bullets)

    //     if (towerData.action) {
    //         components[towerData.action.component] = {
    //             parent: this.scene.getLayer(30),
    //             handler: createTowerActionHandler(this.getCreateEntity(bulletContainer, "bullet")),
    //             actionType: towerData.action.type
    //         }
    //     }

    //     return components
    // }

    // getCreateEntity = (container, tags) => {
    //     return (components) => {
    //         container.addChild(this.scene.entitySystem.createEntity(components, tags))
    //     }
    // }

    
// function handleDamageAction(source, target) {
//     const cmpStats = source.getComponent("Stats")
//     const cmpHealth = target.getComponent("Health")

//     if (cmpHealth && cmpHealth.isAlive()) {
//         cmpHealth.reduce(cmpStats.current.damage)
//     }
// }

// function handleBulletAction(source, target, createEntity) {
//     const [ cmpTower, cmpStats ] = source.getComponents(["Tower", "Stats"])

//     const components = {
//         "Transform": {
//             position: cmpTower.getHeadEndPosition()
//         },
//         "Display": {
//             displayObject: new Sprite(game.assets.Bullet),
//         },
//         "Movement": {
//             speed: 500,
//             angle: cmpTower.getHeadRotation(),
//             maxDistance: cmpStats.current.range,
//             enableFacingDirection: true,
//             onFinished: (source) => source.despawn()
//         },
//         "Collideable": {
//             radius: Math.max(game.assets.Bullet.width, game.assets.Bullet.height),
//             static: false,
//             onHit: (bulletEntity, targetEntity) => {
//                 bulletEntity.despawn()

//                 if (targetEntity.hasTag("enemy")) {
//                     handleDamageAction(source, targetEntity)
//                 }
//             }
//         },
//     }

//     createEntity(components)
// }

// function createTowerActionHandler(createEntity) {
//     return (actionType, source, target) => {
//         switch(actionType) {
//             case "direct_damage": handleDamageAction(source, target); break;
//             case "create_bullet": handleBulletAction(source, target, createEntity); break;
//             default: new Error("Undefined actionType")
//         }
//     }
// }
