import { IModule } from "game/scenes"
import { Rect } from "game/graphics"
import { Tile } from "game/core"
import { Container, Sprite } from "pixi.js"

const TowerSize = 50    // Todo: get rid of me, please

function handleDamageAction(source, target) {
    const [ cmpStats ] = source.getComponents(["Stats"])
    const health = target.getComponent("Health")

    if (health) {
        if (health.isAlive() && health.reduce(cmpStats.current.damage)) {
            game.emit("enemy_killed", target.id)
        }
    }
    else {
        throw new Error(`Unable to deal damage. Target entity is missing "health" component.`)
    }
}

function handleBulletAction(source, target, createEntity) {
    const [ cmpTower, cmpStats ] = source.getComponents(["Tower", "Stats"])

    const components = {
        "Transform": {
            position: cmpTower.getHeadEndPosition()
        },
        "Display": {
            displayObject: new Sprite(game.assets.Bullet),
        },
        "Movement": {
            speed: 500,
            angle: cmpTower.getHeadRotation(),
            maxDistance: cmpStats.current.range,
            enableFacingDirection: true,
            onFinished: (source) => source.despawn()
        },
        "Collideable": {
            radius: Math.max(game.assets.Bullet.width, game.assets.Bullet.height),
            static: false,
            ignoreTags: ["bullet"],
            onHit: (bulletEntity, targetEntity) => {
                bulletEntity.despawn()

                if (targetEntity.hasTag("enemy")) {
                    handleDamageAction(source, targetEntity)
                }
            }
        },
    }

    createEntity(components)
}

function createTowerActionHandler(createEntity) {
    return (actionType, source, target) => {
        switch(actionType) {
            case "direct_damage": handleDamageAction(source, target); break;
            case "create_bullet": handleBulletAction(source, target, createEntity); break;
            default: new Error("Undefined actionType")
        }
    }
}

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
        const { pos, tower } = event
        const { grid } = this.scene

        const snapped = grid.snapPosToTile(pos)
        const bounds = new Rect(snapped.x + 1, snapped.y + 1, TowerSize, TowerSize)

        const tiles = grid.getTilesByBounds(bounds)
                               .filter(tile => !grid.isTileObstructed(tile))

        if (tiles.length < 4) {
            console.warn("Can not build here", pos)
            return
        }

        grid.setTilesBlocked(tiles, true)

        const topLeft = grid.getTopLeftTile(tiles).pos
        const components = this.getTowerComponents(tower, topLeft.add(Tile.Size - TowerSize / 2))

        try {
            const entity = this.scene.entitySystem.createEntity(components, "tower")
            this.container.addChild(entity)

            game.emit("tower_built")
        }
        catch (e) {
            return console.error(e)
        }
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
        const components = {
            "Transform": {
                position
            },
            "Tower": {
                baseSprite: new Sprite(game.assets[towerData.base.textureId]),
                headSprite: new Sprite(game.assets[towerData.head.textureId]),
                headPosition: towerData.head.position,
                headPivot: towerData.head.pivot
            },
            "Stats": {
                ...towerData.stats
            },
            "OnClick": {
                onClick: (entity) => { game.emit("tower_clicked", entity.id) }
            },
        }

        const bulletContainer = this.scene.getLayer(this.scene.Layers.Bullets)

        if (towerData.action) {
            components[towerData.action.component] = {
                parent: this.scene.getLayer(30),
                handler: createTowerActionHandler(this.getCreateEntity(bulletContainer, "bullet")),
                actionType: towerData.action.type
            }
        }

        return components
    }

    getCreateEntity = (container, tags) => {
        return (components) => {
            container.addChild(this.scene.entitySystem.createEntity(components, tags))
        }
    }
}
