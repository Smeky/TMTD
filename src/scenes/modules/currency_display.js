import { IModule } from "."
import { Text } from "pixi.js"
import { Game } from "game/"
import { Widget } from "game/ui"

export default class CurrencyDisplay extends IModule {
    setup() {
        const baseStore = Game.stores.base
        
        this.cachedCurrency = null
        this.widget = Game.ui.addChild(new Widget())
        this.textObject = this.widget.addChild(new Text("", { fill: 0xffffff, fontSize: 22 }))
        
        this.updateText(baseStore.state.currency)
        this.updatePosition()

        baseStore.subscribe(this.handleCurrencyChanged)
    }
    
    close() {
        Game.ui.removeChild(this.widget)
        Game.stores.base.removeListener(this.handleCurrencyChanged)
    }

    handleCurrencyChanged = (state) => {
        this.updateText(state.currency)
    }

    updateText(value) {
        if (this.cachedCurrency !== value) {
            this.cachedCurrency = value
            this.textObject.text = `$ ${value}`
        }
    }

    updatePosition() {
        this.widget.x = Math.round(Game.getCanvasSize().x / 2)
        this.widget.y = 30
    }
}
