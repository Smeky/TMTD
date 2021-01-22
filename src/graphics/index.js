import * as pixi from "pixi.js"

pixi.utils.skipHello() // Don't spam the console banner

class Graphics {
    constructor() {
        this.app = new pixi.Application({
            width: 1024,
            height: 768,
            antialias: true,
            backgroundColor: 0x313548
        })

        document.getElementById("app").appendChild(this.app.view)
        
        this.renderer = pixi.autoDetectRenderer()
        this.camera = new pixi.Container()
        this.app.stage.addChild(this.camera)
    }
}

export default Graphics