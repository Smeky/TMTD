import * as pixi from "pixi.js"

export default class Debugger extends pixi.Container {
    constructor() {
        super()

        game.ticker.add(this.updateDisplays)
        
        this.centerRuler = new pixi.Graphics()
        this.centerRuler.lineStyle(1, 0xff0000)
        this.centerRuler.moveTo(0, -window.innerHeight / 2 - 1)
        this.centerRuler.lineTo(0,  window.innerHeight / 2 + 1)
        this.centerRuler.moveTo(-window.innerWidth / 2 - 1, 0)
        this.centerRuler.lineTo( window.innerWidth / 2 + 1, 0)
        this.centerRuler.endFill()
        this.centerRuler.visible = false

        this.boundsGraphics = new pixi.Graphics()
        this.displayedObjects = []

        this.addChild(this.boundsGraphics)
        this.addChild(this.centerRuler)
    }

    toggleCenterRuler() {
        this.centerRuler.visible = !this.centerRuler.visible
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

    updateDisplays = () => {
        this.boundsGraphics.clear()
        this.boundsGraphics.lineStyle(2, 0xff0000)

        for (const obj of this.displayedObjects) {
            let {x, y, width, height} = obj.getBounds()
            
            // Todo: Update this to stage pivot
            x += -window.innerWidth / 2
            y += -window.innerHeight / 2

            this.boundsGraphics.drawRect(x - 1, y - 1, width + 2, height + 2)
        }

        this.boundsGraphics.endFill()
    }
}

