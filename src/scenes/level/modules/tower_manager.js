import { IModule } from "game/scenes"
import { Rect } from "game/graphics"
import { Tile } from "game/core"
import { Container, Sprite } from "pixi.js"

const TowerSize = 50    // Todo: get rid of me, please

function handleDamageAction(data) {
    const { target, amount } = data
    const health = target.getComponent("health")

    if (health) {
        if (health.isAlive() && health.reduce(amount)) {
            game.emit("enemy_killed", target)
        }
    }
    else {
        throw new Error(`Unable to deal damage. Target entity is missing "health" component.`)
    }
}

function handleBulletAction(data, scene) {
    const { texture, pos, angle, speed, range } = data

    const components = {
        "transform": {
            pos
        },
        "display": {
            displayObject: new Sprite(texture),
        },
        "movement": {
            speed,
            angle,
            maxDistance: range,
            enableFacingDirection: true,
        },
    }

    const entity = scene.entitySystem.createEntity(components)
    scene.addChild(entity, scene.Layers.Bullets)

    entity.on("movement.finished", (entity) => entity.despawn())
}

function createTowerActionHandler(scene) {
    return (actionType, data) => {
        switch(actionType) {
            case "deal_damage": handleDamageAction(data); break;
            case "create_bullet": handleBulletAction(data, scene); break;
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
            const cmpTower = entity.getComponent("tower")
            const cmpStats = entity.getComponent("stats")
            
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

        const pos = entity.getComponent("transform").pos
        const snapped = this.scene.grid.snapPosToTile(pos)
        const bounds = new Rect(snapped.x + 1, snapped.y + 1, TowerSize, TowerSize)
        const tiles = this.scene.grid.getTilesByBounds(bounds)

        this.scene.grid.setTilesBlocked(tiles, false)
        this.scene.entitySystem.removeEntity(entity.id)

        game.emit("tower_removed", entityId)
    }
    
    getTowerComponents(towerData, position) {
        const components = {
            "transform": {
                pos: position
            },
            "tower": {
                base: towerData.base,
                head: towerData.head,
            },
            "stats": {
                ...towerData.stats
            },
            "onClick": {
                onClick: (entity) => { game.emit("tower_clicked", entity.id) }
            },
        }

        if (towerData.action) {
            components[towerData.action.component] = {
                handler: createTowerActionHandler(this.scene),
                parent: this.scene.getLayer(30),
            }
        }

        return components
    }
}