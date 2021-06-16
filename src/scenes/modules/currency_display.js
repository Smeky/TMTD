import { IModule } from "."
import { Text } from "pixi.js"
import { Game } from "game/"

export default class CurrencyDisplay extends IModule {
    setup() {
        const baseStore = Game.stores.base
        
        this.cachedCurrency = null
        this.textObject = new Text("", { fill: 0xffffff, fontSize: 22 })
        Game.uiContainer.addChild(this.textObject)
        
        this.updateText(baseStore.state.currency)
        this.updatePosition()

        baseStore.subscribe(this.handleCurrencyChanged)
        Game.on("window_resized", this.onWindowResized)
    }
    
    close() {
        Game.uiContainer.removeChild(this.textObject)
        Game.stores.base.removeListener(this.handleCurrencyChanged)
        Game.removeListener("window_resized", this.onWindowResized)
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
        this.textObject.x = Math.round(Game.getCanvasSize().x / 2) - 50
        this.textObject.y = 30
    }
}
