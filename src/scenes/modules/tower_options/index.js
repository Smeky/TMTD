import { createCrossIcon, createUpgradeIcon } from "game/ui/icons"
import { Container } from "pixi.js";
import { IModule } from "../."
import LevelLayers from "game/scenes/level/layers"

import OptionsButton from "./options_button"
import { Game } from "game/";

export default class TowerOptions extends IModule {
    setup() {
        this.selectedId = null

        this.container = new Container()
        this.container.visible = false

        Game.world.addChild(this.container, LevelLayers.TowerOptions)

        const texture = Game.assets.TowerOptionsButton
        const buttons = [
            // { icon: createUpgradeIcon(0xffeb74, 4), callback: () => Game.emit("upgrade_tower", this.selectedId) },
            { icon: createCrossIcon(0xa20e0e, 4),   callback: () => Game.emit("remove_tower",  this.selectedId) },
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

        Game.on("tower_clicked", this.onTowerClicked)
        Game.on("unselect_tower", this.onUnselectTower)
        Game.on("tower_removed", this.onTowerRemoved)
    }

    close() {
        Game.world.removeChild(this.container)

        Game.removeListener("tower_clicked", this.onTowerClicked)
        Game.removeListener("unselect_tower", this.onUnselectTower)
        Game.removeListener("tower_removed", this.onTowerRemoved)
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
        const entity = Game.world.ecs.getEntity(entityId)
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