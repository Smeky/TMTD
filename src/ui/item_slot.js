import { Game } from "game/"
import { Vec2 } from "game/graphics"
import { Container, Sprite } from "pixi.js"
import CurrentTheme from "./themes"

const InventoryColors = CurrentTheme.colors.inventory

export default class ItemSlot extends Container {
    constructor() {
        super()

        this.interactive = true
        this.isPressed = false

        this.border = new Sprite(Game.assets.InventorySlot)
        this.border.tint = InventoryColors.slotEmpty

        this.size = new Vec2(this.border.width, this.border.height)

        this.icon = new Sprite()
        this.icon.position.copyFrom(this.size.divide(2))
        this.icon.anchor.set(0.5, 0.5)
        this.icon.width = this.size.x - 4
        this.icon.height = this.size.y - 4

        this.highlight = new Sprite(Game.assets.InventorySlotHightlight)
        this.highlight.alpha = 0.1
        this.highlight.visible = false

        this.addChild(this.border)
        this.addChild(this.highlight)
        this.addChild(this.icon)

        this.on("pointerdown", this.onPointerDown)
        this.on("pointerover", this.onPointerOver)
        this.on("pointermove", this.onPointerMove)
        this.on("pointerout", this.onPointerOut)
        this.on("pointerup", this.onPointerUp)
        this.on("pointerupoutside", this.onPointerUp)
        this.on("dragdrop", this.onDragDrop)
    }

    onPointerDown = () => { this.isPressed = true }
    onPointerOver = () => { this.highlight.visible = true }
    onPointerOut = () => { this.highlight.visible = false }
    onPointerUp = () => { this.isPressed = false }
    onPointerMove = () => {
        if (this.isPressed && this.item) {
            const item = this.removeItem()

            Game.dragAndDrop.setup({
                type: "item",
                data: item,
                texture: Game.assets[item.iconId],
                onCancel: () => { this.setItem(item) },
                onSwap: (other) => { this.setItem(other) },
            })
        }
    }

    onDragDrop = (dragAndDrop) => {
        if (dragAndDrop.type === "item") {
            if (this.item) {
                const item = this.removeItem()
                this.setItem(dragAndDrop.swap(item))
            }
            else {
                this.setItem(dragAndDrop.accept())
            }
        }
    }

    handleDragDrop(data) {
        if (data.type === "item") {
            this.setItem(data.item)
        }
    }

    setItem(item) {
        this.icon.texture = Game.assets[item.iconId]
        this.item = item

        this.updateBorder()
    }

    removeItem() {
        const item = this.item
        this.item = null

        this.icon.texture = null
        this.updateBorder()

        return item
    }

    hasItem() {
        return !!this.item
    }

    updateBorder() {
        if (this.item) {
            this.border.tint = InventoryColors.slotFilledGeneric
        }
        else {
            this.border.tint = InventoryColors.slotEmpty
        }
    }
}
