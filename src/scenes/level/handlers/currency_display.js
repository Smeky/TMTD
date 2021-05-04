import IHandler from "."
import { Text } from "pixi.js"

export default class CurrencyDisplay extends IHandler {
    init() {
        this.textObject = new Text("132", { fill: 0xffffff, fontSize: 22 })
        this.textObject.x = Math.round(game.width / 2) - 50
        this.textObject.y = 30
        
        this.scene.addChild(this.textObject, 70)
        this.updateText()

        game.on("target_killed", this.onTargetKilled)
    }
    
    close() {
        this.scene.removeChild(this.textObject)
        game.removeListener("target_killed", this.onTargetKilled)
    }

    onTargetKilled = (event) => {
        this.scene.currency += 5
        this.updateText()
    }

    updateText() {
        this.textObject.text = `$ ${this.scene.currency}`
    }
}