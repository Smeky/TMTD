import findPath from "game/core/pathfinding"
import utils from "game/utils"
import { Scene } from "game/scenes"
import { Entities } from "game/entity"
import { Rect, Vec2 } from "game/graphics"
import { Grid } from "game/core/grid"
import { Tile } from "game/core/tile"
import { Camera } from "game/core/camera"
import { BuildMode } from "game/core/buildmode"
import { TowerBar } from "game/core/towerBar"
import { EntitySelection } from "game/core/entitySelection"
import { Sprite } from "pixi.js"
import { TowerOptions } from "game/ui"

const TowerSize = 50

// Todo: this should be defined somewhere else. Not sure where atm
async function createTowerList() {
    return [
        {
            id: 1,
            name: "The Ancient One",
            size: new Vec2(TowerSize),
            base: {
                texture: utils.createRectTexture(new Rect(0, 0, TowerSize, TowerSize), 0x35352f),
            },
            head: {
                texture: utils.createRectTexture(new Rect(0, 0, 8, 35), 0xffff00),
                pos: new Vec2(0.5), // relative to center
                pivot: new Vec2(4, 6),
                attack: {
                    range: 150,
                    damage: 1,
                    rate: 0.05,
                }
            }
        }
    ]
}

export default class LevelScene extends Scene {
    static __Name = "level"

    constructor() {
        super()

        this.cdEntity = 1
        this.cdEntityProgress = this.cdEntity - 0.1

        this.enemyMeta = {
            entities: 0,
            levelRaise: 10,
            difficulty: 1,
            maxHp: 100,
            maxArmor: 0,
            color: 0xffffff
        }
    }

    async load() {
        this.grid = new Grid()
        
        await this.grid.loadFromFile("dev.json")
        return await createTowerList()
    }

    setup(towers) {
        this.towers = towers

        this.setupCamera()
        this.setupGameLogic()
        this.setupLayers()
        this.setupEvents()

        this.setupTowerSelection()

        // tmp
        const entity = this.entities.children[this.entities.children.length - 5]
        this.handleTowerClicked(entity)
    }

    setupCamera() {
        this.camera = new Camera({
            size: new Vec2(game.width, game.height),
            zoomEnabled: true,
            dragEnabled: true,
        })

        const gridSize = this.grid.sizeInPixels()
        const centered = new Vec2(
            (game.width - gridSize.x) / 2,
            (game.height - gridSize.y) / 2,
        )

        this.camera.moveTo(centered.round())
    }

    setupGameLogic() {
        this.towerBar = new TowerBar(this.towers)
        this.entities = new Entities()

        this.buildMode = new BuildMode({
            grid: this.grid,
            camera: this.camera,
        })
        
        this.towerBar.x = Math.round(game.width / 2)
        this.towerBar.y = game.height - 50
        this.towerBar.on("towerSelected", tower => {
            this.buildMode.setSelectedTower(tower)
            this.buildMode.toggle()
        })
        this.towerBar.on("towerUnselected", () => {
            this.buildMode.toggle()
        })
        
        {   // Put down some towers right away
            const placements = [
                new Vec2(160, 64),
                new Vec2(160, 160),
                new Vec2(32, 160),
                new Vec2(320, 128),
                new Vec2(288, 32),
                new Vec2(128, 256),
                new Vec2(288, 256),
                new Vec2(416, 224),
            ]

            for (const pos of placements) {
                this.buildTower(this.towers[0], pos)
            }
        }

        {   // Calculate path
            const pathTiles = this.grid.getPathTiles()
                .map(tile => new Vec2(tile.pos).divide(Tile.Size))
    
            const start = new Vec2(3, 2)
            const end = new Vec2(14, 11)
    
            this.path = findPath({ cells: pathTiles, start, end })
                .map(cell => cell.multiply(Tile.Size))
        }
    }

    setupLayers() {
        this.addChild(this.camera, 10)
        this.addChild(this.buildMode, 50)
        this.addChild(this.towerBar, 70)

        this.camera.addChild(this.grid, 10)
        this.camera.addChild(this.entities, 15)
    }

    setupEvents() {
        this.inputProxy = game.input.getProxy()
        this.inputProxy.on("keyup", this.handleKeyUp)

        game.on("buildTower", this.handleBuildTower)
    }

    setupTowerSelection() {
        this.entitySelection = new EntitySelection()

        this.towerOptions = new TowerOptions()
        this.towerOptions.on("click", this.handleTowerSelectClick)
        this.towerOptions.visible = false

        this.camera.addChild(this.entitySelection, 18)
        this.camera.addChild(this.towerOptions, 55)
    }

    close() {
        this.camera.close()
        this.buildMode.close()
        this.inputProxy.close()

        game.removeListener("buildTower", this.handleBuildTower)
    }

    update(delta) {
        if (!this.started) return

        this.entities.update(delta)
        this.buildMode.update(delta)

        this.cdEntityProgress += delta
        if (this.cdEntityProgress >= this.cdEntity) {
            this.cdEntityProgress %= this.cdEntity

            this.createEnemy()
            this.enemyMeta.entities++

            if (this.enemyMeta.entities % this.enemyMeta.levelRaise === 0) {
                this.increaseDifficulty()
            }
        }
    }

    increaseDifficulty() {
        this.enemyMeta.difficulty++
        this.enemyMeta.color *= 0.95

        if (this.enemyMeta.color < 0x000000) {
            this.enemyMeta.color = 0x000000
        }

        this.enemyMeta.maxHp *= 1.2
        this.enemyMeta.maxArmor *= (1 - this.enemyMeta.maxArmor) * 1.2
    }

    createEnemy() {
        const components = {
            "transform": {
                pos: new Vec2(3 * Tile.Size, 2 * Tile.Size)
            },
            "display": {
                displayObject: new Sprite(utils.createRectTexture(new Rect(0, 0, 16, 16), this.enemyMeta.color)),
            },
            "movement": {
                speed: 70,
                destinations: this.path,
            },
            "health": {
                maximum: this.enemyMeta.maxHp,
                armor: this.enemyMeta.maxArmor,
                parent: this.camera.getLayer(50),
            }
        }

        const entity = this.entities.createEntity(components, "enemy")
        entity.on("destReached", () => {
            this.entities.removeEntity(entity.id)
            // remove health
        })
        entity.on("noHealth", () => {
            this.entities.removeEntity(entity.id)
            // add points
        })
    }

    buildTower(tower, pos) {
        const snapped = this.grid.snapPosToTile(pos)
        const bounds = new Rect(snapped.x + 1, snapped.y + 1, TowerSize, TowerSize)

        const tiles = this.grid.getTilesByBounds(bounds)
                               .filter(tile => !this.grid.isTileObstructed(tile))

        if (tiles.length < 4) {
            console.warn("Can not build here", pos)
            return
        }

        this.grid.setTilesBlocked(tiles, true)
        const topLeft = this.grid.getTopLeftTile(tiles)

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
                layer: this.camera.getLayer(20),
            }
        }

        try {
            const entity = this.entities.createEntity(components)
            entity.interactive = true
            entity.on("click", () => this.handleTowerClicked(entity))
        }
        catch (e) {
            return console.error(e)
        }

        game.emit("towerBuilt")
    }

    removeTower(entity) {
        const pos = entity.getComponent("transform").pos
        const snapped = this.grid.snapPosToTile(pos)
        const bounds = new Rect(snapped.x + 1, snapped.y + 1, TowerSize, TowerSize)
        const tiles = this.grid.getTilesByBounds(bounds)

        this.grid.setTilesBlocked(tiles, false)
        this.entities.removeEntity(entity.id)
    }

    handleBuildTower = (pos) => {
        this.buildTower(this.towerBar.getSelectedTower(), pos)
    }

    handleKeyUp = (event) => {
        if (event.key === "1") {
            this.towerBar.selectTower(0)
        }
        else if (event.key === "Escape") {
            if (this.buildMode.enabled) {
                this.towerBar.clearSelection()
            }

            if (this.entitySelection.hasSelected()) {
                this.entitySelection.clearSelection()
                this.towerOptions.visible = false
            }
        }
    }

    handleTowerClicked = (entity) => {
        this.entitySelection.selectEntity(entity)

        const isSelected = this.entitySelection.hasSelected()
        this.towerOptions.visible = isSelected
        
        if (isSelected) {
            const cmpTranform = entity.getComponent("transform")
            const cmpTower = entity.getComponent("tower")

            const center = cmpTranform.pos.add(cmpTower.data.size.divide(2))
            this.towerOptions.setCenter(center)
        }
    }

    handleTowerSelectClick = (id) => {
        if (id === "remove") {
            this.removeTower(this.entitySelection.selected)
            this.towerOptions.visible = false
            this.entitySelection.clearSelection()
        }
        
        if (id === "upgrade") {
            
        }
    }
}