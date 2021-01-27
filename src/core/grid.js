import * as pixi from "pixi.js"
import utils from "game/utils"
import { Rect, Vec2 } from "game/core/structs"

class GridCell {
    constructor(index, x, y, w, h) {
        this.index = index
        this.x = x
        this.y = y
        
        // Replace by flags so we can use switch for alpha value by state
        this.isVisible = false
        this.isHighlighted = false

        this.sprite = pixi.Sprite.from("../../media/tile.png")
        this.sprite.anchor.set(0.5, 0.5)
        this.sprite.alpha = 0
        this.sprite.x = x * w + w / 2
        this.sprite.y = y * h + h / 2
    }

    setVisible(state) {
        this.isVisible = state
        this.updateAlpha()
    } 

    setHighlighted(state) {
        this.isHighlighted = state
        this.updateAlpha()
    }

    updateAlpha() {
        if (!this.isVisible) {
            this.sprite.alpha = 0
            return
        }

        if (this.isHighlighted) {
            this.sprite.alpha = 0.3
        }
        else {
            this.sprite.alpha = 0.02
        }
    }
}

class Grid {
    constructor() {
        this.gridWidth   = 32
        this.gridHeight  = 24
        this.cellWidth   = 32
        this.cellHeight  = 32

        this.isDisplayGridOn = false

        // Todo: don't forget to cleanup
        this.eventProxy = game.events.getProxy()
        
        this.setupGrid()
    }

    setupGrid() {
        const rect = new pixi.Graphics()
        rect.beginFill(0xff0000)
        rect.drawRect(0, 0, 30, 30)
        rect.endFill()

        this.spriteContainer = new pixi.Container()
        game.graphics.camera.addChild(this.spriteContainer)

        this.cells = []

        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const index = x + this.gridWidth * y
                const cell = new GridCell(index, x, y, this.cellWidth, this.cellHeight)

                this.cells.push(cell)
                this.spriteContainer.addChild(cell.sprite)
            }            
        }
    }

    toggleDisplayGrid() {
        this.isDisplayGridOn = !this.isDisplayGridOn

        this.cells.forEach(cell => cell.setVisible(this.isDisplayGridOn))

        if (this.isDisplayGridOn) {
            this.eventProxy.listen("mousemove", this.onMouseMove)
        }
        else {
            this.eventProxy.leave("mousemove", this.onMouseMove)
        }
    }

    onMouseMove = (event) => {
        const x = event.layerX - this.cellWidth / 2
        const y = event.layerY - this.cellHeight / 2

        const posIndex = new Vec2(
            Math.floor(x / this.cellWidth),
            Math.floor(y / this.cellHeight),
        )

        const pos = utils.clampPosInBounds(posIndex, new Rect(0, 0, this.gridWidth - 2, this.gridHeight - 2))

        // Select 4 cells around the cursor (tpi = top left index)
        const tpi = pos.x + this.gridWidth * pos.y
        const indices = [tpi, tpi + 1, tpi + this.gridWidth, tpi + this.gridWidth + 1]

        // Check if we should highlight some new cells
        if (!indices.every(index => this.cells[index].isHighlighted)) {
            this.cells.forEach(cell => cell.setHighlighted(false))
            indices.forEach(index => this.cells[index].setHighlighted(true))
        }
    }
}

export default Grid