import { SceneBase } from "game/scenes"
import { Vec2, Layers } from "game/graphics"
import { findPath, Tile } from "game/core"
import { Observable } from "game/core"
import { EnemyWaves, BuildMode, TowerBar, TowerOptions, TowerManager, CurrencyDisplay } from "./modules"

const SceneLayers = {
    Grid: 10,

    TowerBase: 15,
    EnemyBase: 15,
    TowerSelection: 18,

    Bullets: 20,
    Beams: 21,

    BuildmodeTiles: 50,
    BuildmodeHighlight: 51,
    
    EnemyHealthBar: 53,
    TowerOptions: 55,
}

const UILayers = {
    Base: 10,
}

export default class LevelScene extends SceneBase {
    static Name = "level"
    static Modules = [
        EnemyWaves, BuildMode, TowerBar, TowerOptions, TowerManager, CurrencyDisplay
    ]

    constructor() {
        super()

        this.Layers = SceneLayers

        this.ui = new Layers()
        this.ui.Layers = UILayers

        game.stage.addChild(this.ui)

        this.currency = new Observable(0)
        this.currency.subscribe(value => game.emit("currency_changed", value))
        
        this.inputProxy = game.input.getProxy()
        this.inputProxy.on("keyup", this.handleKeyUp)
    }

    async load() {
        await game.world.grid.loadFromFile("dev.json")
        return await super.load()
    }

    setupScene() {
        this.setupLevel()
        this.positionCamera()
    }

    closeScene() {
        this.inputProxy.close()

        game.stage.removeChild(this.ui)
    }

    positionCamera() {
        const gridSize = game.world.grid.sizeInPixels()
        const centered = game.getCanvasSize().subtract(gridSize).divide(2)

        game.world.resetZoom()
        game.world.moveTo(centered.round())
    }

    setupLevel() {
        // Calculate path
        const pathTiles = game.world.grid.getPathTiles()
            .map(tile => new Vec2(tile.pos).divide(Tile.Size))

        const start = new Vec2(3, 2)
        const end = new Vec2(14, 11)

        this.path = findPath({ cells: pathTiles, start, end })
            .map(cell => cell.multiply(Tile.Size))
            .slice(1)
    }

    update(delta) {
        if (!this.started) return

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