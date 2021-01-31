import { TilePalette } from "game/core/palette"
import { Tile } from "game/core/tile"
import Scene from "game/scenes/scene"
import { Vec2 } from "game/core/structs"
import * as pixi from "pixi.js"
import { Entities } from "game/entity/entities"
import { PathFinder } from "../core/pathfinder"

export default class LevelScene extends Scene {
    constructor() {
        super("level")

        this.inputProxy = game.input.getProxy()

        this.entities = new Entities()

        this.setupGrid()
        this.path();
        this.createEntity()
        
        this.cd = 0.3
        this.cdProgress = 0.0
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
        // Temporary, duh :D 
        const { pivot } = this.gridContainer
        /*         const path = [
                    new Vec2(5  * Tile.Size - pivot.x, 6  * Tile.Size - pivot.y),
                    new Vec2(12 * Tile.Size - pivot.x, 6  * Tile.Size - pivot.y),
                    new Vec2(12 * Tile.Size - pivot.x, 13 * Tile.Size - pivot.y),
                ] */

        const entity = this.entities.createEntity()
        const transform = entity.addComponent("transform")

        transform.pos.x = 5 * Tile.Size - pivot.x
        transform.pos.y = - pivot.y

        const display = entity.addComponent("display")
        display.object = new pixi.Sprite.from("media/tile.png")
        display.object.anchor.set(0.5, 0.5)

        this.sceneContainer.addChild(display.object)

        const movement = entity.addComponent("movement")
        movement.speed = 100
        movement.destinations = movement.destinations.concat(this.finalPath)

        this.entities.initEntity(entity)
    }

    update(delta) {
        this.entities.update(delta)

        if (this.entities.length < 30) {
            this.cdProgress += delta
            if (this.cdProgress >= this.cd) {
                this.cdProgress %= this.cd

                this.createEntity()
            }
        }
    }
}