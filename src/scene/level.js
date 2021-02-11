import { Scene } from "game/scene"
import { Entities } from "game/entity"
import { Grid } from "game/core/grid"
import { Tile } from "game/core/tile"
import * as pf from "game/core/pathfinding"
import { TowerSelection } from "game/core/towerSelection"
import { Rect, Vec2 } from "game/graphics"
import * as pixi from "pixi.js"
import utils from "game/utils"

const TowerSize = 50

export default class LevelScene extends Scene {
    constructor() {
        super("level")

        this.sceneContainer.interactive = true
        this.sceneContainer.on("mouseup", this.handleMouseUp)
        
        // Todo: Please, please, need a better solution
        // Setup layers so we can control zIndex better
        this.sceneContainer.sortableChildren = true
        this.containers = ["grid", "entities", "ui"]
            .map((name, index) => {
                const container = new pixi.Container()
                
                this.sceneContainer.addChild(container)
                container.zIndex = index

                return [name, container]
            })
            .reduce((acc, [name, container]) => {
                acc[name] = container
                return acc 
            }, {})

        this.inputProxy = game.input.getProxy()

        this.entities = new Entities()
        this.containers.entities.addChild(this.entities)

        this.towerSelection = new TowerSelection()
        this.containers.ui.addChild(this.towerSelection)

        this.started = false
        this.load()
            .then(this.start())
            
        this.cdEntity = 1
        this.cdEntityProgress = 0.0
    }

    async load() {
        this.grid = new Grid()
        this.containers.grid.addChild(this.grid)

        await this.grid.loadFromFile("dev.json")

        const start = new Vec2(3, 2)
        const end = new Vec2(14, 11)

        // Todo: Temporary - Hacky solution to center everything based on grid's size
        this.sceneContainer.pivot = this.grid.pivot
        this.grid.pivot.set(0, 0)

        this.towerSelection.x = this.sceneContainer.pivot.x
        this.towerSelection.y = this.sceneContainer.getLocalBounds().height + 50

        // Todo:vectors: fix into divide(Tile.size)
        const pathTiles = this.grid.getPathTiles()
                                   .map(tile => new Vec2(tile.pos).divide(new Vec2(Tile.Size, Tile.Size)))

        this.path = pf.findPath({cells: pathTiles, start, end}).map(cell => cell.multiply(Tile.Size))

        // this.path.forEach((pos) => 
        //     game.debug.displayPoint(new Vec2(
        //         pos.x + this.sceneContainer.pivot.x / 2,
        //         pos.y + this.sceneContainer.pivot.y / 2 + 16, // no idea why +16
        //     ))
        // )
    }

    start() {
        this.started = true
    }

    close() {
        this.inputProxy.close()
    }

    createEntity() {
        const components = {
            "transform": {
                pos: new Vec2(3 * Tile.Size, 2 * Tile.Size)
            },
            "display": {
                displayObject: new pixi.Sprite(utils.createRectTexture(new Rect(0, 0, 16, 16), 0xffffff))
            },
            "movement": {
                speed: 70,
                destinations: this.path
            },
            "health": {
                maximum: 100
            }
        }

        const entity = this.entities.createEntity(components, "enemy")
        entity.on("destReached", () => {
            this.entities.removeEntity(entity.id)
        })

        // const dd = game.debug.displayBounds(entity)
        // setTimeout(() => dd.destroy(), 2000)
    }

    update(delta) {
        if (!this.started) return

        this.entities.update(delta)

        if (this.entities.count() < 70) {
            this.cdEntityProgress += delta
            if (this.cdEntityProgress >= this.cdEntity) {
                this.cdEntityProgress %= this.cdEntity
    
                this.createEntity()
            }
        }
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
                anchor: new Vec2(0, 0),
            },
            "tower": {
                headDisplay: new pixi.Sprite(utils.createRectTexture(new Rect(0, 0, 8, 25), 0xffff00)),
                headPos: new Vec2(TowerSize / 2),
                size: TowerSize,
                range: 300,
            }
        }

        this.entities.createEntity(components)
    }

    handleMouseUp = (event) => {
        const pos = new Vec2(event.data.getLocalPosition(this.sceneContainer))
        this.createTower(pos)
    }
}