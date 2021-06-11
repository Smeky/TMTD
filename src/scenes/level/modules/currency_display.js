import IModule from "game/scenes/imodule"
import { Text } from "pixi.js"

export default class CurrencyDisplay extends IModule {
    static Name = "currencyDisplay"

    setup() {
        this.textObject = new Text("", { fill: 0xffffff, fontSize: 22 })
        game.uiContainer.addChild(this.textObject)

        this.updateText()
        this.updatePosition()

        game.on("currency_changed", this.onCurrencyChanged)
        game.on("window_resized", this.onWindowResized)
    }
    
    close() {
        game.uiContainer.removeChild(this.textObject)
        game.removeListener("currency_changed", this.onCurrencyChanged)
        game.removeListener("window_resized", this.onWindowResized)
    }

    onCurrencyChanged = (event) => {
        this.updateText()
    }

    onWindowResized = () => {
        this.updatePosition()
    }

    updateText() {
        this.textObject.text = `$ ${game.currency()}`
    }

    updatePosition() {
        this.textObject.x = Math.round(game.getCanvasSize().x / 2) - 50
        this.textObject.y = 30
    }
}