import utils from "game/utils"
import { Button } from "game/ui"
import IHandler from "."
import { Container } from "pixi.js"

export default class TowerBar extends IHandler {
    constructor(scene, towers) {
        super(scene)

        this.towers = towers // Todo: move when we add load() function to IHandler
    }

    init() { 
        this.selected = -1

        this.container = new Container()
        this.container.x = Math.round(game.width / 2)
        this.container.y = game.height - 80

        this.scene.addChild(this.container, 70)

        this.towers.forEach((tower, index) => {
            const display = utils.createTowerDisplay(tower, Math.PI * 0.9)
            const button = new Button(display)
            
            button.x = 60 * index
            button.on("click", () => this.selectTower(index))

            this.container.addChild(button)
        })

        const { width, height } = this.container.getLocalBounds()
        this.container.pivot.x = Math.round(width / 2) - 25
        this.container.pivot.y = Math.round(height / 2) - 25

        game.on("select_tower", this.onSelectTower)
        game.on("unselect_tower", this.onUnselectTower)
    }

    close() {
        game.removeListener("select_tower", this.onSelectTower)
        game.removeListener("unselect_tower", this.onUnselectTower)
    }

    onSelectTower = (index) => {
        this.selectTower(index)
    }

    onUnselectTower = () => {
        this.clearSelection()
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
        return this.towers[this.selected]
    }
}