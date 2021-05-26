import IModule from "game/scenes/imodule"
import { Text } from "pixi.js"

export default class CurrencyDisplay extends IModule {
    static Name = "currencyDisplay"

    setup() {
        this.textObject = new Text("", { fill: 0xffffff, fontSize: 22 })
        this.scene.ui.addChild(this.textObject, this.scene.ui.Layers.Base)

        this.updateText()
        this.updatePosition()

        game.on("currency_changed", this.onCurrencyChanged)
        game.on("window_resized", this.onWindowResized)
    }
    
    close() {
        this.scene.removeChild(this.textObject)
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
        this.textObject.text = `$ ${this.scene.currency()}`
    }

    updatePosition() {
        this.textObject.x = Math.round(game.getCanvasSize().x / 2) - 50
        this.textObject.y = 30
    }
}