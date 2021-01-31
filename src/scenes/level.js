import {EntityHandler} from "game/entities"
import {TilePalette} from "game/core/palette"
import {Tile} from "game/core/tile"
import Scene from "game/scenes/scene"
import { Vec2 } from "game/core/structs"
import * as cmps from "game/entities/components"
import * as pixi from "pixi.js"
import utils from "game/utils"

export default class LevelScene extends Scene {
    constructor() {
        super("level")

        this.sceneContainer.sortableChildren = true  // enable zindex for sprites

        this.inputProxy = game.input.getProxy()
        this.entityHandler = new EntityHandler()

        this.setupGrid()
        
        this.cd = 0.7
        this.cdProgress = 0.0
    }
    
    close() {
        this.inputProxy.close()
    }

    setupGrid() {
        this.gridWidth = 16
        this.gridHeight = 13

        this.grid = []
        this.gridContainer = new pixi.Container()
        this.gridContainer.pivot.x = (this.gridWidth * Tile.Size) / 2
        this.gridContainer.pivot.y = (this.gridHeight * Tile.Size) / 2

        this.palette = new TilePalette("media/tileset.png")

        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if ((x >= 4  && x <= 5  && y >= 0 && y <= 5) ||
                    (x >= 4  && x <= 12 && y >= 5 && y <= 6) ||
                    (x >= 11 && x <= 12 && y >= 6 && y <= 13)) 
                {
                    this.palette.selectTile(11)
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
        const texture = new pixi.Texture.from("media/tile.png")

        const {pivot} = this.gridContainer
        const path = [
            new Vec2(5  * Tile.Size - pivot.x, 6  * Tile.Size - pivot.y),
            new Vec2(12 * Tile.Size - pivot.x, 6  * Tile.Size - pivot.y),
            new Vec2(12 * Tile.Size - pivot.x, 13 * Tile.Size - pivot.y),
        ]

        const entity = this.entityHandler.createEntity()
        const pos = new Vec2(- Tile.Size * 3, (- 13 / 2) * Tile.Size)

        entity.addComponent(new cmps.TransformComponent(pos))

        const movementCmp = entity.addComponent(new cmps.MovementComponent({velocity: 50}))
        path.forEach(point => movementCmp.moveTo(point))

        const spriteCmp = entity.addComponent(new cmps.SpriteComponent(texture))
        spriteCmp.sprite.anchor.set(0.5, 0.5)

        this.entityContainer.addChild(entity)
        entity.init()
    }

    update(delta) {
        this.entityHandler.update(delta)

        if (this.entityHandler.entities.length < 30) {
            this.cdProgress += delta
            if (this.cdProgress >= this.cd) {
                this.cdProgress %= this.cd
    
                this.createEntity()
            }
        }

    }
}