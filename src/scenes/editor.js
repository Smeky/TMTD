import Scene from "game/scenes/scene"
import * as pixi from "pixi.js"

export default class EditorScene extends Scene {
    constructor() {
        super("editor")

        this.toggle = false // Todo: remove this. Gonna need Scene transition for this effect

        this.eventProxy = game.events.getProxy()

        const gra = new pixi.Graphics()
        gra.beginFill(0xff0000)
        gra.drawRect(0, 0, 100, 100)
        gra.endFill()
        
        const tex = game.graphics.createTextureFromObject(gra)
        const sprite = new pixi.Sprite.from(tex)
        this.sceneContainer.addChild(sprite)
    }

    close() {
        this.eventProxy.close()
    }
}