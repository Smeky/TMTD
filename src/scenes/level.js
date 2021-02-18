import { Scene } from "game/scenes"
import { Entities } from "game/entity"
import { Grid } from "game/core/grid"
import { Tile } from "game/core/tile"
import { Camera } from "game/core/camera"
import * as pf from "game/core/pathfinding"
import { TowerSelection } from "game/core/towerSelection"
import { Rect, Vec2 } from "game/graphics"
import { Layers } from "game/graphics/layers"
import * as pixi from "pixi.js"
import utils from "game/utils"

const TowerSize = 50

export default class LevelScene extends Scene {
    static __Name = "level"

    constructor() {
        super()

        this.interactive = true
        this.on("mouseup", this.handleMouseUp)

        {   // Setup camera
            this.cameraLayers = new Layers()
            this.camera = new Camera({
                size: new Vec2(game.width, game.height),
                zoomEnabled: true,
                dragEnabled: true,
            })

            this.addChild(this.camera, 10)
            this.camera.addChild(this.cameraLayers)
        }

        // Part of UI, goes to Scene layers
        this.towerSelection = new TowerSelection()
        this.addChild(this.towerSelection, 20)

        this.entities = new Entities()
        this.cameraLayers.addChild(this.entities, 15)

        this.started = false
        this.load()
            .then(() => this.start())

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
        this.cameraLayers.addChild(this.grid, 10)
        
        await this.grid.loadFromFile("dev.json")

        {   // position camera
            const size = this.grid.sizeInPixels()
            const centered = new Vec2(
                (game.width - size.x) / 2,
                (game.height - size.y) / 2,
            )

            this.camera.moveTo(centered.round())
        }

        const start = new Vec2(3, 2)
        const end = new Vec2(14, 11)

        // Todo: Temporary - Hacky solution to center everything based on grid's size
        this.pivot = this.grid.pivot
        this.grid.pivot.set(0, 0)

        this.towerSelection.x = Math.round(game.width / 2)
        this.towerSelection.y = game.height - 50

        // Todo:vectors: fix into divide(Tile.size)
        const pathTiles = this.grid.getPathTiles()
            .map(tile => new Vec2(tile.pos).divide(new Vec2(Tile.Size, Tile.Size)))

        this.path = pf.findPath({ cells: pathTiles, start, end }).map(cell => cell.multiply(Tile.Size))

        // this.path.forEach((pos) => 
        //     game.debug.displayPoint(new Vec2(
        //         pos.x + this.pivot.x / 2,
        //         pos.y + this.pivot.y / 2 + 16, // no idea why +16
        //     ))
        // )
    }

    start() {
        this.started = true

        // Place some towers so we don't have to do it ourselfs every reload
        const _ = [
            new Vec2(160, 64),
            new Vec2(160, 160),
            new Vec2(32, 160),
            new Vec2(320, 128),
            new Vec2(288, 32),
            new Vec2(128, 256),
            new Vec2(288, 256),
            new Vec2(416, 224),
        ].forEach(pos => this.createTower(pos))
    }

    close() {
        this.camera.close()
    }

    update(delta) {
        if (!this.started) return

        this.entities.update(delta)

        if (this.entities.count() < 70) {
            this.cdEntityProgress += delta
            if (this.cdEntityProgress >= this.cdEntity) {
                this.cdEntityProgress %= this.cdEntity

                this.createEntity()
                this.enemyMeta.entities++
                const { entities, levelRaise } = this.enemyMeta
                if (entities % levelRaise === 0) {
                    this.increaseDifficulty()
                }
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
    createEntity() {
        const components = {
            "transform": {
                pos: new Vec2(3 * Tile.Size, 2 * Tile.Size)
            },
            "display": {
                displayObject: new pixi.Sprite(utils.createRectTexture(new Rect(0, 0, 16, 16), this.enemyMeta.color)),
                parent: this.cameraLayers.getLayer(10),
            },
            "movement": {
                speed: 70,
                destinations: this.path,
            },
            "health": {
                maximum: this.enemyMeta.maxHp,
                armor: this.enemyMeta.maxArmor,
                parent: this.cameraLayers.getLayer(50),
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

        // const dd = game.debug.displayBounds(entity)
        // setTimeout(() => dd.destroy(), 2000)
    }

    createTower(pos) {
        const snapped = this.grid.snapPosToTile(pos)
        const tiles = this.grid.getTilesByBounds(new Rect(snapped.x + 1, snapped.y + 1, TowerSize, TowerSize))
            .filter(tile => !this.grid.isTileObstructed(tile))

        if (tiles.length < 4) {
            console.warn("Can not build here", pos)
            return
        }
        else {
            // Todo: tiles should be immutable, this should be done via the grid
            for (const tile of tiles) {
                tile.isBlocked = true
            }
        }

        const baseBounds = new Rect(0, 0, TowerSize, TowerSize)
        const baseTexture = utils.createRectTexture(baseBounds, this.towerSelection.getSelectedTower())

        // Todo: fix this when we fix grid indices
        // Just find topleft tile.. 
        const topleft = tiles.reduce((candidate, tile) => {
            if (!candidate) {
                candidate = tile
            }
            else {
                if (tile.x < candidate.x || tile.y < candidate.y) {
                    candidate = tile
                }
            }

            return candidate
        }, null)

        const components = {
            "transform": {
                pos: topleft.pos.add(Tile.Size - TowerSize / 2)
            },
            "display": {
                displayObject: new pixi.Sprite(baseTexture),
                parent: this.cameraLayers.getLayer(10),
                anchor: new Vec2(0, 0),
            },
            "tower": {
                headDisplay: new pixi.Sprite(utils.createRectTexture(new Rect(0, 0, 8, 25), 0xffff00)),
                headPos: new Vec2(TowerSize / 2),
                parent: this.cameraLayers.getLayer(15),
                size: TowerSize,
                range: 150,
                attack: {
                    damage: 1,
                    rate: 0.05,
                }
            }
        }

        this.entities.createEntity(components)
    }

    handleMouseUp = (event) => {
        const pos = new Vec2(event.data.getLocalPosition(this))
        this.createTower(this.camera.correctMousePos(pos))
    }
}