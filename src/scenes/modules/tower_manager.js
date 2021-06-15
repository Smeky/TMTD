import { IModule } from "game/scenes"
import { Rect } from "game/graphics"
import { TowerData } from "game/data"
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

    onBuildTower = (event) => { this.buildTower(event.towerId, event.pos) }
    onRemoveTower = (entityId) => { this.removeTower(entityId) }

    buildTower(towerId, position) {
        const { grid } = Game.world

        if (!TowerData.hasOwnProperty(towerId)) {
            return console.error(`Failed to build tower - invalid towerId ${towerId}`)
        }

        const snapped = grid.snapPosToTile(position)
        const texture = Game.assets[TowerData[towerId].textureId]
        const bounds = new Rect(snapped.x + 1, snapped.y + 1, texture.width, texture.height)

        const tiles = grid.getTilesByBounds(bounds)

        if (!tiles || tiles.some(grid.isTileObstructed)) {
            console.warn("Can not build here", position)
            return
        }

        grid.setTilesBlocked(tiles, true)

        const towerData = TowerData[towerId]
        // tiles[3].pos is basically center if tiles.length == 4.. I cheated a little, Todo :D 
        const components = this.getTowerComponents(towerData, tiles[3].pos)
        Game.world.ecs.createEntity(components, "Tower")
    }

    removeTower(entityId) {
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
        }
    }
}
