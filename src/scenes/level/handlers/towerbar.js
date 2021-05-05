import utils from "game/utils"
import IHandler from "game/scenes/handler"
import { Button } from "game/ui"
import { Rect, Vec2 } from "game/graphics"
import { Container } from "pixi.js"

const TowerSize = 50    // Todo: get rid of me, please

export default class TowerBar extends IHandler {
    static Name = "towerBar"

    init() { 
        this.selected = -1

        // Temporary
        this.towers = [
            {
                id: 1,
                name: "The Ancient One",
                size: new Vec2(TowerSize),
                base: {
                    texture: utils.createRectTexture(new Rect(0, 0, TowerSize, TowerSize), 0x35352f),
                },
                head: {
                    texture: utils.createRectTexture(new Rect(0, 0, 8, 35), 0xffff00),
                    pos: new Vec2(0.5), // relative to center
                    pivot: new Vec2(4, 6),
                    attack: {
                        range: 150,
                        damage: 1,
                        rate: 0.05,
                    }
                }
            }
        ]

        
        this.container = new Container()
        this.scene.addChild(this.container, 70)
        
        this.towers.forEach((tower, index) => {
            const display = utils.createTowerDisplay(tower, Math.PI * 0.9)
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
        return this.towers[this.selected]
    }

    updateContainerPosition() {
        const { width, height } = this.container.getLocalBounds()
        
        this.container.x = Math.round(game.width / 2)
        this.container.y = game.height - 40
        this.container.pivot.x = Math.round(width / 2) - 25
        this.container.pivot.y = Math.round(height / 2) - 25
    }
}