import { Game } from "game/"
import { ECSSystem } from "."

export default class SocketableSystem extends ECSSystem {
    static Dependencies = ["socketable", "display"]

    setupEntity(entity) {
        const { socketable, display } = entity.components

        const pickupGem = () => {
            const gem = socketable.gem
            this.removeGem(entity)

            Game.dragAndDrop.setup({
                type: "item",
                data: gem,
                sprite: gem.icon,
                onCancel: () => {
                    this.socketGem(entity, gem)
                }
            })
        }

        display.on("dragdrop", (dragAndDrop) => {
            if (dragAndDrop.type === "item") {
                this.socketGem(entity, dragAndDrop.conclude())
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
    }

    removeGem(entity) {
        const { socketable, display } = entity.components

        display.removeChild(socketable.gem.icon)
        socketable.gem = null
    }
}
