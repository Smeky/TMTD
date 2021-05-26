import IModule from "game/scenes/imodule"
import { Vec2 } from "game/graphics"
import { createCrossIcon, createUpgradeIcon } from "game/ui/icons"
import { Container } from "pixi.js";

import EntitySelection from "./entity_selection"
import OptionsButton from "./options_button"

export default class TowerOptions extends IModule {
    static Name = "towerOptions"

    setup() {
        this.entitySelection = new EntitySelection()
        this.container = new Container()
        this.container.visible = false

        this.scene.addChild(this.entitySelection, this.scene.Layers.TowerSelection)
        this.scene.addChild(this.container, this.scene.Layers.TowerOptions)

        const size = new Vec2(50)
        const buttons = [
            { icon: createUpgradeIcon(0xffeb74, 4), callback: this.emitUpgradeTower },
            { icon: createCrossIcon(0xa20e0e, 4), callback: this.emitRemoveTower },
        ]
        .forEach((data, index) => {
            const angle = Math.PI * 1.9 + index * (Math.PI * 0.32)
            const button = new OptionsButton(data.icon, size)

            button.pivot.copyFrom(size.divide(2))
            button.x = Math.cos(angle) * 75
            button.y = Math.sin(angle) * 75
            button.on("click", data.callback)
    
            this.container.addChild(button)
        })

        game.on("entity_clicked", this.onEntityClicked)
        game.on("unselect_tower", this.onUnselectTower)
        game.on("tower_removed", this.onTowerRemoved)
    }

    close() {
        this.scene.removeChild(this.entitySelection)
        this.scene.removeChild(this.container)

        game.removeListener("entity_clicked", this.onEntityClicked)
        game.removeListener("unselect_tower", this.onUnselectTower)
        game.removeListener("tower_removed", this.onTowerRemoved)
    }

    emitUpgradeTower = () => {
        game.emit("upgrade_tower", this.entitySelection.selected.id)
    }

    emitRemoveTower = () => {
        game.emit("remove_tower", this.entitySelection.selected.id)
    }

    onEntityClicked = (entityId) => {
            const entity = this.scene.entitySystem.getEntityById(entityId)

            if (!entity || !entity.hasTag("tower")) {
                return
            }

            this.entitySelection.selectEntity(entity)
            const isSelected = this.entitySelection.hasSelected()

            this.container.visible = isSelected
            
            if (isSelected) {
                const cmpTranform = entity.getComponent("transform")
                const cmpTower = entity.getComponent("tower")
    
                const center = cmpTranform.pos.add(cmpTower.size.divide(2))
                this.container.position.copyFrom(center)
            }
    }

    onUnselectTower = () => {
        this.clearTowerSelection()
    }

    onTowerRemoved = (entityId) => {
        if (this.entitySelection.hasSelected() && this.entitySelection.selected.id === entityId) {
            this.clearTowerSelection()
        }
    }

    clearTowerSelection() {
        this.entitySelection.clearSelection()
        this.container.visible = false
    }
}