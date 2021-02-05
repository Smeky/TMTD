import { Scene } from "./index"
import { Grid } from "game/core/grid"
import * as pixi from "pixi.js"
import utils from "game/utils"

export default class TomGroundScene extends Scene {
    constructor() {
        super("tomground")

        this.grid = new Grid()
        this.grid.loadFromFile("dev.json")
        this.sceneContainer.addChild(this.grid)

        game.on("windowResized", event => console.log("resize", event.after))

        // Todo: move this to camera
        this.setupBlueprintBg()
    }

    update(delta) {

    }

    setupBlueprintBg() {
        const rowSize = 16
        const grpSize = 5

        // Pixi's 'amazing' number colors don't work with alpha..
        this.bp = [
            new pixi.Graphics(),
            new pixi.Graphics(),
        ]

        this.sceneContainer.addChild(this.bp[0])
        this.sceneContainer.addChild(this.bp[1])

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