import IHandler from "game/scenes/handler"
import { Text } from "pixi.js"

export default class CurrencyDisplay extends IHandler {
    static Name = "currencyDisplay"

    init() {
        this.textObject = new Text("", { fill: 0xffffff, fontSize: 22 })
        this.textObject.x = Math.round(game.width / 2) - 50
        this.textObject.y = 30
        
        this.scene.addChild(this.textObject, 70)
        this.updateText()

        game.on("currency_changed", this.onCurrencyChanged)
    }
    
    close() {
        this.scene.removeChild(this.textObject)
        game.removeListener("currency_changed", this.onCurrencyChanged)
    }

    onCurrencyChanged = (event) => {
        this.updateText()
    }

    updateText() {
        this.textObject.text = `$ ${this.scene.currency()}`
    }
}