import { createTowerDisplay } from "game/utils"
import { IModule } from "."
import { Button } from "game/ui"
import { Container } from "pixi.js"
import { TowerData } from "game/data"
import { Game } from "game/"

export default class TowerBar extends IModule {
    setup() { 
        this.selected = -1
        
        this.container = new Container()
        Game.uiContainer.addChild(this.container)
        
        let offset = 0
        for (const [id, tower] of Object.entries(TowerData)) {
            const display = createTowerDisplay(tower, Math.PI * 0.9)
            const button = new Button(display)
            
            button.x = (offset += 60)
            button.on("click", () => this.selectTower(id))

            this.container.addChild(button)
        }

        this.updateContainerPosition()

        Game.on("select_tower", this.onSelectTower)
        Game.on("unselect_tower", this.onUnselectTower)
        Game.on("window_resized", this.onWindowResized)
    }

    close() {
        Game.removeListener("select_tower", this.onSelectTower)
        Game.removeListener("unselect_tower", this.onUnselectTower)
        Game.removeListener("window_resized", this.onWindowResized)
    }

    onSelectTower = (index) => {
        const ids = Object.keys(TowerData)

        if (ids.length - 1 < index) {
            return console.error(`Failed to select tower by index ${index}. Index out of bounds of TowerData`)
        }

        this.selectTower(ids[index])
    }

    onUnselectTower = () => {
        this.clearSelection()
    }

    onWindowResized = (event) => {
        this.updateContainerPosition()
    }

    selectTower(id) {
        if (this.selected !== id) {
            this.selected = id
            Game.emit("tower_selected", id)
        }
        else {
            this.clearSelection()
        }
    }

    clearSelection() {
        if (this.selected) {
            this.selected = null
            Game.emit("tower_unselected")
        }
    }

    getSelectedTower() {
        return this.selected
    }

    updateContainerPosition() {
        const { width, height } = this.container.getLocalBounds()
        const canvasSize = Game.getCanvasSize()
        
        this.container.x = Math.round(canvasSize.x / 2)
        this.container.y = canvasSize.y - 40
        this.container.pivot.x = Math.round(width / 2) - 25
        this.container.pivot.y = Math.round(height / 2) - 25
    }
}