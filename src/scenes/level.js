import { TilePalette } from "game/core/palette"
import { Tile } from "game/core/tile"
import Scene from "game/scenes/scene"
import { Vec2 } from "game/core/structs"
import * as pixi from "pixi.js"
import { ECS } from "game/entity/entities"
import { PathFinder } from "../core/pathfinder"

export default class LevelScene extends Scene {
    constructor() {
        super("level")
        
        // Todo: Please, please, need a better solution
        // Setup layers so we can control zIndex better
        this.sceneContainer.sortableChildren = true
        this.containers = ["grid", "entities", "healthbars"]
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
        
        this.setupGrid()
        this.path()
        this.createEntity()
        
        this.cdEntity = 0.45
        this.cdEntityProgress = 0.0
    }

    path() {
        this.pathFinder = new PathFinder(this.availableTiles,
            { x: 5, y: 0 },
            { x: 12, y: 12 },
            this.gridContainer.pivot)
        this.pathFinder.findPath()
        this.finalPath = this.pathFinder.getPath();
    }

    close() {
        this.inputProxy.close()
    }

    setupGrid() {
        this.gridWidth = 16
        this.gridHeight = 13

        this.availableTiles = []
        this.grid = []
        this.gridContainer = new pixi.Container()
        this.gridContainer.pivot.x = (this.gridWidth * Tile.Size) / 2
        this.gridContainer.pivot.y = (this.gridHeight * Tile.Size) / 2

        this.palette = new TilePalette("media/tileset.png")

        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if ((x >= 4 && x <= 5 && y >= 0 && y <= 5) ||
                    (x >= 4 && x <= 12 && y >= 5 && y <= 6) ||
                    (x >= 11 && x <= 12 && y >= 6 && y <= 13)) {
                    this.palette.selectTile(11)
                    this.availableTiles.push({ x: x, y: y })
                }
                else {
                    this.palette.selectTile(4)
                }

                const sprite = new pixi.Sprite(this.palette.getSelectedTileTexture())

                sprite.width = Tile.Size
                sprite.height = Tile.Size
                sprite.x = x * Tile.Size
                sprite.y = y * Tile.Size

                this.gridContainer.addChild(sprite)
            }
        }

        this.sceneContainer.addChild(this.gridContainer)

        this.entityContainer = new pixi.Container()
        this.sceneContainer.addChild(this.entityContainer)
    }

    createEntity() {
        const { pivot } = this.gridContainer

        const sprite = new pixi.Sprite.from("media/tile.png")
        sprite.anchor.set(0.5, 0.5)
        this.containers.entities.addChild(sprite)

        const components = {
            "transform": {
                pos: new Vec2(5 * Tile.Size - pivot.x, - pivot.y)
            },
            "display": {
                object: sprite
            },
            "movement": {
                speed: 150,
                destinations: this.finalPath
            },
            "health": {
                parent: this.containers.healthbars
            }
        }

        const entity = this.entities.createEntity(components)
        this.entities.initEntity(entity)

        entity.on("destReached", () => {
            this.entities.removeEntity(entity.id)
            console.log(`Entity ${entity.id} reached destination`)
        })
    }

    update(delta) {
        this.entities.update(delta)

        if (this.entities.count() < 70) {
            this.cdEntityProgress += delta
            if (this.cdEntityProgress >= this.cdEntity) {
                this.cdEntityProgress %= this.cdEntity
    
                this.createEntity()
            }
        }
    }
}