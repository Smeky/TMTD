import { createTowerDisplay } from "game/utils"
import IModule from "game/scenes/imodule"
import { Button } from "game/ui"
import { Container } from "pixi.js"
import TowerData from "game/data/tower_data"

export default class TowerBar extends IModule {
    static Name = "towerBar"

    setup() { 
        this.selected = -1
        
        this.container = new Container()
        this.scene.ui.addChild(this.container, this.scene.ui.Layers.Base)
        
        TowerData.forEach((tower, index) => {
            const display = createTowerDisplay(tower, Math.PI * 0.9)
            const button = new Button(display)
            
            button.x = 60 * index
            button.on("click", () => this.selectTower(index))

            this.container.addChild(button)
        })

        this.updateContainerPosition()

        game.on("select_tower", this.onSelectTower)
        game.on("unselect_tower", this.onUnselectTower)
        game.on("window_resized", this.onWindowResized)
    }

    close() {
        game.removeListener("select_tower", this.onSelectTower)
        game.removeListener("unselect_tower", this.onUnselectTower)
        game.removeListener("window_resized", this.onWindowResized)
    }

    onSelectTower = (index) => {
        this.selectTower(index)
    }

    onUnselectTower = () => {
        this.clearSelection()
    }

    onWindowResized = (event) => {
        this.updateContainerPosition()
    }

    selectTower(index) {
        if (this.selected === index) {
            this.selected = -1
            game.emit("tower_unselected")
        }
        else {
            this.selected = index
            game.emit("tower_selected", this.getSelectedTower())
        }
    }

    clearSelection() {
        if (this.selected >= 0) {
            this.selectTower(this.selected)
        }
    }

    getSelectedTower() {
        return TowerData[this.selected]
    }

    updateContainerPosition() {
        const { width, height } = this.container.getLocalBounds()
        const canvasSize = game.getCanvasSize()
        
        this.container.x = Math.round(canvasSize.x / 2)
        this.container.y = canvasSize.y - 40
        this.container.pivot.x = Math.round(width / 2) - 25
        this.container.pivot.y = Math.round(height / 2) - 25
    }
}