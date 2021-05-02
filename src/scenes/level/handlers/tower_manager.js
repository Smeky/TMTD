import IHandler from "."
import { Vec2, Rect } from "game/graphics"
import { Tile } from "game/core"

const TowerSize = 50    // Todo: get rid of me, please

export default class TowerManager extends IHandler {
    init() {
        game.on("build_tower", this.onBuildTower)
        game.on("upgrade_tower", this.onUpgradeTower)
        game.on("remove_tower", this.onRemoveTower)
    }

    close() {
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
        const topLeft = grid.getTopLeftTile(tiles)

        const components = {
            "transform": {
                pos: topLeft.pos.add(Tile.Size - TowerSize / 2)
            },
            "display": {
                anchor: new Vec2(0, 0),
            },
            "tower": {
                data: tower,
            },
            "laser": {
                layer: game.camera.getLayer(20),
            }
        }

        try {
            this.scene.entities.createEntity(components, "tower")
            game.emit("tower_built")
        }
        catch (e) {
            return console.error(e)
        }
    }

    onUpgradeTower = (entityId) => {
        const entity = this.scene.entities.getEntityById(entityId)

        if (entity) {
            const cmpTower = entity.getComponent("tower")
            const cmpLaser = entity.getComponent("laser")

            cmpTower.damage += 1
            cmpLaser.sprite.tint += 0x000308    // Todo: we need something better to modify the color

            game.emit("tower_upgraded", entityId)
        }
        else {
            throw new Error(`Unable to find entity (tower) id: ${entityId} for upgrade`)
        }
    }

    onRemoveTower = (entityId) => {
        const entity = this.scene.entities.getEntityById(entityId)

        const pos = entity.getComponent("transform").pos
        const snapped = this.scene.grid.snapPosToTile(pos)
        const bounds = new Rect(snapped.x + 1, snapped.y + 1, TowerSize, TowerSize)
        const tiles = this.scene.grid.getTilesByBounds(bounds)

        this.scene.grid.setTilesBlocked(tiles, false)
        this.scene.entities.removeEntity(entity.id)

        game.emit("tower_removed", entityId)
    }
}