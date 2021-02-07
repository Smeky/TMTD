import { Grid } from "game/core/grid"
import { Tile } from "game/core/tile"
import { Scene } from "game/scene"
import { Rect, Vec2 } from "game/core/structs"
import * as pixi from "pixi.js"
import { ECS } from "game/entity/entities"
import * as pf from "game/core/pathfinding"
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
        this.containers = ["grid", "towers", "entities", "healthbars"]
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
        this.entities = new ECS()

        this.started = false
        this.load()
            .then(this.start())
            
        this.cdEntity = 0.4
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

        // Todo:vectors: fix into divide(Tile.size)
        const pathTiles = this.grid.getPathTiles()
                                   .map(tile => new Vec2(tile.pos).divide(new Vec2(Tile.Size, Tile.Size)))

        this.path = pf.findPath({cells: pathTiles, start, end}).map(cell => cell.multiply(Tile.Size))
    }

    start() {
        this.started = true
    }

    close() {
        this.inputProxy.close()
    }

    createEntity() {
        const sprite = new pixi.Sprite.from("media/tile.png")
        sprite.anchor.set(0.5, 0.5)
        this.containers.entities.addChild(sprite)

        const components = {
            "transform": {
                pos: new Vec2(3 * Tile.Size, 2 * Tile.Size)
            },
            "display": {
                object: sprite
            },
            "movement": {
                speed: 200,
                destinations: this.path
            },
            "health": {
                parent: this.containers.healthbars
            }
        }

        const entity = this.entities.createEntity(components)
        this.entities.initEntity(entity)

        entity.on("destReached", () => {
            this.entities.removeEntity(entity.id)
        })
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
        const baseTexture = utils.createRectTexture(baseBounds, 0xff0000)
        const baseSprite = new pixi.Sprite(baseTexture)

        this.containers.towers.addChild(baseSprite)

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
                object: baseSprite
            }
        }

        const entity = this.entities.createEntity(components)
        this.entities.initEntity(entity)
    }

    handleMouseUp = (event) => {
        const pos = new Vec2(event.data.getLocalPosition(this.sceneContainer))
        this.createTower(pos)
    }
}