import { IModule } from "."
import { Text } from "pixi.js"

export default class CurrencyDisplay extends IModule {
    setup() {
        const baseStore = game.stores.base
        
        this.cachedCurrency = null
        this.textObject = new Text("", { fill: 0xffffff, fontSize: 22 })
        game.uiContainer.addChild(this.textObject)
        
        this.updateText(baseStore.state.currency)
        this.updatePosition()

        baseStore.subscribe(this.handleCurrencyChanged)
        game.on("window_resized", this.onWindowResized)
    }
    
    close() {
        game.uiContainer.removeChild(this.textObject)
        game.stores.base.removeListener(this.handleCurrencyChanged)
        game.removeListener("window_resized", this.onWindowResized)
    }

    handleCurrencyChanged = (state) => {
        this.updateText(state.currency)
    }

    onWindowResized = () => {
        this.updatePosition()
    }

    updateText(value) {
        if (this.cachedCurrency !== value) {
            this.cachedCurrency = value
            this.textObject.text = `$ ${value}`
        }
    }

    updatePosition() {
        this.textObject.x = Math.round(game.getCanvasSize().x / 2) - 50
        this.textObject.y = 30
    }
}
