import { Scene } from "game/scenes"
import { Entities } from "game/entity"
import { Vec2 } from "game/graphics"
import { findPath, Grid, Tile } from "game/core"
import { Observable } from "game/core"

import {
    EnemyWaves, 
    BuildMode, 
    TowerBar, 
    TowerOptions, 
    TowerManager, 
    CurrencyDisplay, 
    DamageHandler,
    BulletHandler,
    createHandlersStore
} from "./handlers"

export default class LevelScene extends Scene {
    static __Name = "level"

    constructor() {
        super()
    }

    async load() {
        this.grid = new Grid()
        
        await this.grid.loadFromFile("dev.json")
    }

    setup() {
        this.currency = new Observable(0)
        this.currency.on("change", value => game.emit("currency_changed", value))
        
        // Todo: like above, but more of a system
        this.entities = new Entities()
        
        // Todo: move this logic upstairs (IScene)
        this.handlers = createHandlersStore(
            this,
            [ EnemyWaves, BuildMode, TowerBar, TowerOptions, TowerManager, CurrencyDisplay, 
              DamageHandler, BulletHandler ]
        )

        for (const handler of Object.values(this.handlers)) {
            handler.init()
        }
        
        game.camera.addChild(this.grid, 10)
        game.camera.addChild(this.entities, 15)
        
        this.inputProxy = game.input.getProxy()
        this.inputProxy.on("keyup", this.handleKeyUp)

        this.setupLevel()
        this.positionCamera()
    }

    positionCamera() {
        const gridSize = this.grid.sizeInPixels()
        const centered = new Vec2(
            (game.width - gridSize.x) / 2,
            (game.height - gridSize.y) / 2,
        )

        game.camera.moveTo(centered.round())
    }

    setupLevel() {
        // Put down some towers right away
        const placements = [
            new Vec2(160, 64),
            new Vec2(160, 160),
            new Vec2(32, 160),
            new Vec2(320, 128),
            new Vec2(288, 32),
            new Vec2(128, 256),
            new Vec2(288, 256),
            new Vec2(416, 224),
        ].forEach((pos, index) => {
            game.emit("build_tower", { pos, tower: this.handlers.towerBar.towers[index % 2] })
        })

        // Calculate path
        const pathTiles = this.grid.getPathTiles()
            .map(tile => new Vec2(tile.pos).divide(Tile.Size))

        const start = new Vec2(3, 2)
        const end = new Vec2(14, 11)

        this.path = findPath({ cells: pathTiles, start, end })
            .map(cell => cell.multiply(Tile.Size))
    }

    close() {
        this.entities.clear()

        game.camera.removeChild(this.grid)
        game.camera.removeChild(this.entities)

        this.inputProxy.close()

        for (const handler of Object.values(this.handlers)) {
            handler.close()
        }
    }

    update(delta) {
        if (!this.started) return

        this.entities.update(delta)

        for (const handler of Object.values(this.handlers)) {
            handler.update(delta)
        }
    }

    handleKeyUp = (event) => {
        if (event.key === "1") {
            game.emit("select_tower", 0)
        }
        else if (event.key === "2") {
            game.emit("select_tower", 1)
        }
        else if (event.key === "Escape") {
            game.emit("unselect_tower")
        }
    }
}