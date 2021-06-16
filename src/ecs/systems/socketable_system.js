import { Game } from "game/"
import { Sprite } from "pixi.js"
import { ECSSystem } from "."

export default class SocketableSystem extends ECSSystem {
    static Dependencies = ["socketable", "display"]

    setupComponents(entity) {
        const { socketable, display } = entity.components

        const pickupItem = () => {
            const item = this.removeItem(entity)

            Game.dragAndDrop.setup({
                type: "item",
                data: item,
                texture: Game.assets[item.iconId],
                onCancel: () => { this.socketItem(entity, item) },
                onSwap: (otherItem) => { this.socketItem(entity, otherItem) },
            })
        }

        display.on("dragdrop", (dragAndDrop) => {
            if (dragAndDrop.type === "item") {
                if (socketable.item) {
                    const item = this.removeItem(entity)
                    this.socketItem(entity, dragAndDrop.swap(item))
                }
                else {
                    this.socketItem(entity, dragAndDrop.accept())
                }
            }
        })
        display.on("pointerdown", (event) => {
            event.stopPropagation()
            
            if (socketable.item) {
                display.once("pointermove", pickupItem)
                display.once("pointerup", () => { display.removeListener("pointermove", pickupItem) })
                display.once("pointerupoutside", () => { display.removeListener("pointermove", pickupItem) })
            }
        })
    }

    socketItem(entity, item) {
        const { socketable, display } = entity.components
        const { width, height } = display.getLocalBounds()

        socketable.item = item

        socketable.icon = new Sprite(Game.assets[item.iconId])
        socketable.icon.anchor.set(0.5, 0.5)
        socketable.icon.width = width
        socketable.icon.height = height

        display.addChild(socketable.icon)

        this.ecs.addEntityComponents(entity, {
            "towerSkill": { skillId: item.skillId }
        })
    }

    removeItem(entity) {
        const { socketable, display } = entity.components

        if (socketable.item) {
            this.ecs.removeEntityComponents(entity, "towerSkill")
            display.removeChild(socketable.icon)

            const item = socketable.item

            socketable.item = null
            socketable.icon = null

            return item
        }

        return null
    }
}
