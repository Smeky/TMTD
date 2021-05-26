import utils from "game/utils"
import IModule from "game/scenes/imodule"
import { Button } from "game/ui"
import { Rect, Vec2 } from "game/graphics"
import { Container } from "pixi.js"

// Todo: get rid of us, please
const TowerSize = 50 

export default class TowerBar extends IModule {
    static Name = "towerBar"

    async load() {
        // Temporary
        this.towers = [
            {
                id: 1,
                name: "The Ancient One",
                size: new Vec2(TowerSize, TowerSize),
                stats: {
                    attackRate: 0.05,
                    damage: 1,
                    range: 150,
                },
                action: {
                    component: "towerLaserAttack",
                },
                base: {
                    texture: utils.createRectTexture(new Rect(0, 0, TowerSize, TowerSize), 0x35352f),
                },
                head: {
                    texture: utils.createRectTexture(new Rect(0, 0, 8, 35), 0xffff00),
                    pos: new Vec2(0.5), // relative to center
                    pivot: new Vec2(4, 6),
                }
            },
            {
                id: 2,
                name: "Mk Two",
                size: new Vec2(TowerSize, TowerSize),
                stats: {
                    attackRate: 0.3,
                    damage: 18,
                    range: 250,
                },
                action: {
                    component: "towerBulletAttack",
                },
                base: {
                    texture: utils.createRectTexture(new Rect(0, 0, TowerSize, TowerSize), 0x955550),
                },
                head: {
                    texture: utils.createRectTexture(new Rect(0, 0, 8, 35), 0x999999),
                    pos: new Vec2(0.5), // relative to center
                    pivot: new Vec2(4, 6),
                }
            },
        ]
    }

    setup() { 
        this.selected = -1
        
        this.container = new Container()
        this.scene.ui.addChild(this.container, this.scene.ui.Layers.Base)
        
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
        const canvasSize = game.getCanvasSize()
        
        this.container.x = Math.round(canvasSize.x / 2)
        this.container.y = canvasSize.y - 40
        this.container.pivot.x = Math.round(width / 2) - 25
        this.container.pivot.y = Math.round(height / 2) - 25
    }
}