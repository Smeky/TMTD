import { Scene } from "./index"
import { Grid } from "game/core/grid"
import * as pixi from "pixi.js"
import utils from "game/utils"

import {Entities} from "game/entity"
import { Rect, Vec2 } from "game/graphics"

export default class TomGroundScene extends Scene {
    constructor() {
        super("tomground")

        this.grid = new Grid()
        this.grid.loadFromFile("dev.json")
        this.addChild(this.grid)

        game.on("windowResized", event => console.log("resize", event.after))

        // Todo: move this to camera
        this.setupBlueprintBg()

        this.entities = new Entities()
        this.addChild(this.entities)

        this.createEntity()
    }

    update(delta) {
        this.entities.update(delta)
    }

    createEntity() {
        const components = {
            "transform": {
                pos: new Vec2(0, 0)
            },
            "display": {
                displayObject: new pixi.Sprite(utils.createRectTexture(new Rect(0, 0, 16, 16), 0xffffff))
            },
            "movement": {
                speed: 100,
                destinations: [new Vec2(200, 0), new Vec2(200, 200), new Vec2(0, 200), new Vec2(0, 0)]
            }
        }

        this.entities.createEntity(components)
    }

    setupBlueprintBg() {
        const rowSize = 16
        const grpSize = 5

        // Pixi's 'amazing' number colors don't work with alpha..
        this.bp = [
            new pixi.Graphics(),
            new pixi.Graphics(),
        ]

        this.addChild(this.bp[0])
        this.addChild(this.bp[1])

        this.bp[0].alpha = 0.25
        this.bp[0].lineStyle(1, 0xffffff)

        this.bp[1].alpha = 0.07
        this.bp[1].lineStyle(1, 0xffffff)

        // Ewwww
        for (let x = 0; x < Math.round((game.width / 2) / rowSize); x++) {
            if (x % grpSize === 0) {
                this.bp[0].moveTo(x * rowSize, -game.height / 2)
                this.bp[0].lineTo(x * rowSize,  game.height / 2)

                if (x > 0) {
                    this.bp[0].moveTo(-x * rowSize, -game.height / 2)
                    this.bp[0].lineTo(-x * rowSize,  game.height / 2)
                }
            }
            else {
                this.bp[1].moveTo(x * rowSize, -game.height / 2)
                this.bp[1].lineTo(x * rowSize,  game.height / 2)
    
                if (x > 0) {
                    this.bp[1].moveTo(-x * rowSize, -game.height / 2)
                    this.bp[1].lineTo(-x * rowSize,  game.height / 2)
                }
            }
        }

        for (let y = 0; y < Math.round((game.height / 2) / rowSize); y++) {
            if (y % grpSize === 0) {
                this.bp[0].moveTo(-game.width / 2, y * rowSize)
                this.bp[0].lineTo( game.width / 2, y * rowSize)

                if (y > 0) {
                    this.bp[0].moveTo(-game.width / 2, -y * rowSize)
                    this.bp[0].lineTo( game.width / 2, -y * rowSize)
                }
            }
            else {
                this.bp[1].moveTo(-game.width / 2, y * rowSize)
                this.bp[1].lineTo( game.width / 2, y * rowSize)

                if (y > 0) {
                    this.bp[1].moveTo(-game.width / 2, -y * rowSize)
                    this.bp[1].lineTo( game.width / 2, -y * rowSize)
                }
            }
        }
    }
}