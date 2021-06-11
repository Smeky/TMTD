import IModule from "game/scenes/imodule"
import { createCrossIcon, createUpgradeIcon } from "game/ui/icons"
import { Container } from "pixi.js";

import OptionsButton from "./options_button"

export default class TowerOptions extends IModule {
    static Name = "towerOptions"

    setup() {
        this.selectedId = null

        this.container = new Container()
        this.container.visible = false

        this.scene.addChild(this.container, this.scene.Layers.TowerOptions)

        const texture = game.assets.TowerOptionsButton
        const buttons = [
            // { icon: createUpgradeIcon(0xffeb74, 4), callback: () => game.emit("upgrade_tower", this.selectedId) },
            { icon: createCrossIcon(0xa20e0e, 4),   callback: () => game.emit("remove_tower",  this.selectedId) },
        ]
        .forEach((data, index) => {
            const angle = index * (Math.PI * 0.32)
            const button = new OptionsButton(data.icon, texture)

            button.pivot.x = texture.width / 2
            button.pivot.y = texture.height / 2
            button.x = Math.cos(angle) * 75
            button.y = Math.sin(angle) * 75
            button.on("click", data.callback)
    
            this.container.addChild(button)
        })

        game.on("tower_clicked", this.onTowerClicked)
        game.on("unselect_tower", this.onUnselectTower)
        game.on("tower_removed", this.onTowerRemoved)
    }

    close() {
        this.scene.removeChild(this.container)

        game.removeListener("tower_clicked", this.onTowerClicked)
        game.removeListener("unselect_tower", this.onUnselectTower)
        game.removeListener("tower_removed", this.onTowerRemoved)
    }

    onTowerClicked = (entityId) => {
        if (entityId === this.selectedId) {
            return this.clearTowerSelection()
        }

        this.selectTower(entityId)
    }

    onUnselectTower = () => {
        this.clearTowerSelection()
    }

    onTowerRemoved = (entityId) => {
        if (this.selectedId === entityId) {
            this.clearTowerSelection()
        }
    }

    selectTower(entityId) {
        const entity = game.world.ecs.getEntity(entityId)
        const position = entity.components.transform.position


        this.selectedId = entityId
        this.container.visible = true
        this.container.position.copyFrom(position)
    }

    clearTowerSelection() {
        this.selectedId = null
        this.container.visible = false
    }
}