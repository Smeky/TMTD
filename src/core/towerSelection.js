import * as pixi from "pixi.js"
import { Button } from "game/ui/button"
import utils from "game/utils"
import { Rect } from "./structs"

export class TowerSelection extends pixi.Container {
    constructor() { 
        super()

        this.selected = 0
        this.towers = [0xff00ff, 0xffff00, 0x00ffff]

        this.towers.forEach((color, index) => {
            const bounds = new Rect(0, 0, 50, 50)
            const sprite = new pixi.Sprite(utils.createRectTexture(bounds, color))
            const button = new Button(sprite, {
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
            return
        }
        
        this.selected = index
    }

    getSelectedTower() {
        return this.towers[this.selected]
    }
}