import { Game } from "game/"
import { ECSSystem } from "."

export default class SocketableSystem extends ECSSystem {
    static Dependencies = ["socketable", "display"]

    setupComponents(entity) {
        const { socketable, display } = entity.components

        const pickupGem = () => {
            const gem = this.removeGem(entity)

            Game.dragAndDrop.setup({
                type: "item",
                data: gem,
                sprite: gem.icon,
                onCancel: () => { this.socketGem(entity, gem) },
                onSwap: (other) => { this.socketGem(entity, other) },
            })
        }

        display.on("dragdrop", (dragAndDrop) => {
            if (dragAndDrop.type === "item") {
                if (socketable.gem) {
                    const gem = this.removeGem(entity)
                    this.socketGem(entity, dragAndDrop.swap(gem))
                }
                else {
                    this.socketGem(entity, dragAndDrop.accept())
                }
            }
        })
        display.on("pointerdown", (event) => {
            event.stopPropagation()
            
            if (socketable.gem) {
                display.once("pointermove", pickupGem)
                display.once("pointerup", () => { display.removeListener("pointermove", pickupGem) })
                display.once("pointerupoutside", () => { display.removeListener("pointermove", pickupGem) })
            }
        })
    }

    socketGem(entity, item) {
        const { socketable, display } = entity.components

        socketable.gem = item

        {   // Add icon to display
            const { width, height } = display.getLocalBounds()
            item.icon.width = width
            item.icon.height = height
    
            display.addChild(item.icon)
        }

        this.ecs.addEntityComponents(entity, {
            "towerAction": {
                actionId: item.actionId
            }
        })
    }

    removeGem(entity) {
        const { socketable, display } = entity.components

        if (socketable.gem) {
            this.ecs.removeEntityComponents(entity, "towerAction")
            display.removeChild(socketable.gem.icon)

            const gem = socketable.gem
            socketable.gem = null

            return gem
        }

        return null
    }
}
