import * as pixi from "pixi.js"
import {Rect} from "game/core/structs"

pixi.utils.skipHello() // Don't spam the console banner

class Graphics {
    constructor() {
        this.app = new pixi.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true,
            resizeTo: window,
            backgroundColor: 0x000000
        })

        document.getElementById("game").appendChild(this.app.view)
        
        this.renderer = pixi.autoDetectRenderer()
        this.camera = new pixi.Container()
        this.stage = this.app.stage

        this.stage.addChild(this.camera)
        this.stage.pivot.x = Math.round(-window.innerWidth / 2)
        this.stage.pivot.y = Math.round(-window.innerHeight / 2)
    }

    createTextureFromObject(displayObject) {
        const {width, height} = displayObject.getLocalBounds()
        const pixels = this.renderer.extract.pixels(displayObject)

        return pixi.Texture.fromBuffer(pixels, width, height)
    }

    /**
     * Creates a new Sprite instance of rectangular shape
     * @param {Rect} bounds Bounds of the rectangle
     * @param {number} color Hexadecimal color
     * @returns {pixi.Sprite} new PIXI Sprite instance
     */
    createRectSprite(bounds, color) {
        const g = new pixi.Graphics()
        g.beginFill(color)
        g.drawRect(bounds.x, bounds.y, bounds.w, bounds.h)
        g.endFill()

        return new pixi.Sprite.from(this.createTextureFromObject(g))
    }
}

export default Graphics