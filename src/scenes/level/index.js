import { SceneBase } from "game/scenes"
import { EntitySystem } from "game/entity"
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
    DamageModule,
    BulletModule,
} from "./modules"

export default class LevelScene extends SceneBase {
    static Name = "level"
    static Modules = [ 
        EnemyWaves, BuildMode, TowerBar, TowerOptions, TowerManager, CurrencyDisplay, 
        DamageModule, BulletModule 
    ]

    constructor() {
        super()

        this.grid = new Grid()
        this.entitySystem = new EntitySystem()

        this.addChild(this.grid, 10)

        this.currency = new Observable(0)
        this.currency.on("change", value => game.emit("currency_changed", value))
        
        this.inputProxy = game.input.getProxy()
        this.inputProxy.on("keyup", this.handleKeyUp)
    }

    async load() {
        await this.grid.loadFromFile("dev.json")
        return await super.load()
    }

    setupScene() {
        this.setupLevel()
        this.positionCamera()
    }

    closeScene() {
        this.entitySystem.clear()
        this.inputProxy.close()
    }

    positionCamera() {
        const gridSize = this.grid.sizeInPixels()
        const centered = game.getCanvasSize().subtract(gridSize).divide(2)

        game.camera.resetZoom()
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
            game.emit("build_tower", { pos, tower: this.modules.towerBar.towers[index % 2] })
        })

        // Calculate path
        const pathTiles = this.grid.getPathTiles()
            .map(tile => new Vec2(tile.pos).divide(Tile.Size))

        const start = new Vec2(3, 2)
        const end = new Vec2(14, 11)

        this.path = findPath({ cells: pathTiles, start, end })
            .map(cell => cell.multiply(Tile.Size))
    }

    update(delta) {
        if (!this.started) return

        this.entitySystem.update(delta)

        for (const module of this.moduleList) {
            module.update(delta)
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