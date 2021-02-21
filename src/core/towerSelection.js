import * as pixi from "pixi.js"
import { Button } from "game/ui/button"
import utils from "game/utils"
import { Rect } from "game/graphics"

export class TowerSelection extends pixi.Container {
    constructor(towers) { 
        super()

        this.selected = -1

        this.towers = towers
        this.towers.forEach((tower, index) => {
            const display = utils.createTowerDisplay(tower, Math.PI * 0.9)
            const button = new Button(display, {
                onClick: () => this.selectTower(index)
            })

            button.x = 60 * index

            this.addChild(button)
        })

        const { width, height } = this.getLocalBounds()
        this.pivot.x = Math.round(width / 2) - 25
        this.pivot.y = Math.round(height / 2) - 25
    }

    selectTower(index) {
        if (this.selected === index) {
            this.emit("towerUnselected", this.getSelectedTower())
            this.selected = -1
        }
        else {
            this.selected = index
            this.emit("towerSelected", this.getSelectedTower())
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