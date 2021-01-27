import * as pixi from "pixi.js"

export default class Debugger extends pixi.Container {
    constructor() {
        super()
        
        this.boundsGraphics = new pixi.Graphics()
        this.addChild(this.boundsGraphics)

        this.displayedObjects = []
    }

    displayBounds(graphicsObject) {
        this.displayedObjects.push(graphicsObject)
        this.updateDisplays()
    }

    hideBounds(graphicsObject) {
        // Todo: Had no idea by what compare equality of 2 graphics objects, find a better solution
        const index = this.displayedObjects.findIndex(obj => obj._boundsID === graphicsObject._boundsID)
        this.displayedObjects.splice(index, 1)
        this.updateDisplays()
    }

    updateDisplays() {
        this.boundsGraphics.clear()
        this.boundsGraphics.lineStyle(2, 0xff0000)

        for (const obj of this.displayedObjects) {
            const {x, y, width, height} = obj.getBounds()
            this.boundsGraphics.drawRect(x - 1, y - 1, width + 2, height + 2)
        }

        this.boundsGraphics.endFill()
    }
}

