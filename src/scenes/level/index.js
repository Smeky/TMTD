import utils from "game/utils"
import { Scene } from "game/scenes"
import { Entities } from "game/entity"
import { Rect, Vec2 } from "game/graphics"
import { findPath, Grid, Tile, Camera } from "game/core"

import EnemyWaves from "./handlers/enemy_waves"
import BuildMode from "./handlers/buildmode"
import TowerBar from "./handlers/towerbar"
import TowerOptions from "./handlers/tower_options"
import TowerManager from "./handlers/tower_manager"

const TowerSize = 50    // Todo: get rid of me, please

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
    }

    async load() {
        this.grid = new Grid()
        
        await this.grid.loadFromFile("dev.json")
        return await createTowerList() // Todo: remove this logic from IScene
    }

    setup(towers) {
        this.towers = towers
        
        this.setupCamera()

        // Todo: move this logic upstairs (IScene)
        this.handlers = [
            new EnemyWaves(this),
            new BuildMode(this),
            new TowerBar(this, this.towers),
            new TowerOptions(this),
            new TowerManager(this),
        ]

        for (const handler of this.handlers) {
            handler.init()
        }

        this.entities = new Entities()
        
        this.addChild(this.camera, 10)

        this.camera.addChild(this.grid, 10)
        this.camera.addChild(this.entities, 15)
        
        this.inputProxy = game.input.getProxy()
        this.inputProxy.on("keyup", this.handleKeyUp)

        this.setupLevel()
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
        ]

        for (const pos of placements) {
            game.emit("build_tower", { pos, tower: this.towers[0] })
        }

        // Calculate path
        const pathTiles = this.grid.getPathTiles()
            .map(tile => new Vec2(tile.pos).divide(Tile.Size))

        const start = new Vec2(3, 2)
        const end = new Vec2(14, 11)

        this.path = findPath({ cells: pathTiles, start, end })
            .map(cell => cell.multiply(Tile.Size))
    }

    close() {
        this.camera.close()
        this.inputProxy.close()

        for (const handler of this.handlers) {
            handler.close()
        }
    }

    update(delta) {
        if (!this.started) return

        this.entities.update(delta)

        for (const handler of this.handlers) {
            handler.update(delta)
        }
    }

    handleKeyUp = (event) => {
        if (event.key === "1") {
            game.emit("select_tower", 0)
        }
        else if (event.key === "Escape") {
            game.emit("unselect_tower")
        }
    }
}