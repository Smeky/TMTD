import * as pixi from "pixi.js"

pixi.utils.skipHello() // Don't spam the console banner

class Graphics {
    constructor() {
        this.app = new pixi.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true,
            backgroundColor: 0x000000
        })

        document.getElementById("game").appendChild(this.app.view)
        
        this.renderer = pixi.autoDetectRenderer()
        this.camera = new pixi.Container()
        this.stage = this.app.stage

        this.stage.addChild(this.camera)
        this.stage.pivot.x = - window.innerWidth / 2
        this.stage.pivot.y = - window.innerHeight / 2
    }

    createTextureFromObject(displayObject) {
        const {width, height} = displayObject.getLocalBounds()
        const pixels = this.renderer.extract.pixels(displayObject)

        return pixi.Texture.fromBuffer(pixels, width, height)
    }
}

export default Graphics