import IHandler from "game/scenes/level/handlers"
import { Vec2 } from "game/graphics"
import { createCrossIcon, createUpgradeIcon } from "game/ui/icons"
import { Container } from "pixi.js";

import EntitySelection from "./entitySelection"
import OptionsButton from "./optionsButton"

export default class TowerOptions extends IHandler {
    init() {
        this.entitySelection = new EntitySelection()
        this.container = new Container()
        this.container.visible = false

        this.scene.camera.addChild(this.entitySelection, 18)
        this.scene.camera.addChild(this.container, 55)

        const size = new Vec2(50)
        const buttons = [
            { icon: createUpgradeIcon(0xffeb74, 4), callback: this.emitUpgradeTower },
            { icon: createCrossIcon(0xa20e0e, 4), callback: this.emitRemoveTower },
        ]
        .forEach((meta, index) => {
            const angle = Math.PI * 1.9 + index * (Math.PI * 0.32)
            const button = new OptionsButton(meta.icon, size)

            button.pivot.copyFrom(size.divide(2))
            button.x = Math.cos(angle) * 75
            button.y = Math.sin(angle) * 75
            button.on("click", meta.callback)
    
            this.container.addChild(button)
        })

        game.on("entity_clicked", this.onEntityClicked)
        game.on("unselect_tower", this.onUnselectTower)
        game.on("tower_removed", this.onTowerRemoved)
    }

    close() {
        game.removeListener("entity_clicked", this.onEntityClicked)
        game.removeListener("unselect_tower", this.onUnselectTower)
    }

    emitUpgradeTower = () => {
        game.emit("upgrade_tower", this.entitySelection.selected.id)
    }

    emitRemoveTower = () => {
        game.emit("remove_tower", this.entitySelection.selected.id)
    }

    onEntityClicked = (entity) => {
            // Todo: we should probably have tags on entities
            if (!entity.hasComponent("tower")) return

            this.entitySelection.selectEntity(entity)
            const isSelected = this.entitySelection.hasSelected()

            this.container.visible = isSelected
            
            if (isSelected) {
                const cmpTranform = entity.getComponent("transform")
                const cmpTower = entity.getComponent("tower")
    
                const center = cmpTranform.pos.add(cmpTower.data.size.divide(2))
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