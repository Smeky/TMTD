import * as pixi from "pixi.js"

class GridCell {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        
        this.isVisible = false
        this.isBuildable = false
        this.isBlocked = false
        this.isPath = false

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

    updateAlpha() {
        if (this.isVisible) {
            this.sprite.alpha = 0.07
        }
        else {
            this.sprite.alpha = 0
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
                const cell = new GridCell(x, y, this.cellWidth, this.cellHeight)

                this.cells.push(cell)
                this.spriteContainer.addChild(cell.sprite)
            }            
        }
    }

    toggleDisplayGrid() {
        this.isDisplayGridOn = !this.isDisplayGridOn

        this.cells.forEach(cell => cell.setVisible(this.isDisplayGridOn))
    }
}

export default Grid