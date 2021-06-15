import { Game } from "game/";
import { Vec2 } from "game/graphics";
import { Container, Sprite } from "pixi.js";
import { IModule } from ".";

export class InventorySlot extends Container {
    constructor(bgTexture) {
        super()

        this.size = new Vec2(bgTexture.width, bgTexture.height)
        this.interactive = true
        this.isPressed = false

        this.icon = new Sprite()
        this.icon.position.copyFrom(this.size.divide(2))
        this.icon.anchor.set(0.5, 0.5)
        this.icon.width = this.size.x - 4
        this.icon.height = this.size.y - 4

        this.highlight = new Sprite(Game.assets.InventorySlotHightlight)
        this.highlight.alpha = 0.1
        this.highlight.visible = false

        this.addChild(new Sprite(bgTexture))
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
    }

    removeItem() {
        const item = this.item
        this.item = null

        this.icon.texture = null

        return item
    }

    hasItem() {
        return !!this.item
    }
}

class Inventory extends Container {
    /**
     * 
     * @param {Vec2} cellCount
     */
    constructor(cellCount) {
        super()

        this.setupSlots(cellCount)
    }

    get slots() { return this.children }

    setupSlots(cellCount) {
        const slotBgTexture = Game.assets.InventorySlotBg

        for (let y = 0; y < cellCount.y; y++) {
            for (let x = 0; x < cellCount.x; x++) {
                const slot = new InventorySlot(slotBgTexture)

                slot.x = x * (slotBgTexture.width + 2)
                slot.y = y * (slotBgTexture.height + 2)

                this.addChild(slot)
            }
        }
    }

    setItem(index, item) {
        this.slots[index].setItem(item)
    }

    addItem(item) {
        for (let i = 0; i < this.slots.length; i++) {
            if (!this.slots[i].hasItem()) {
                return this.setItem(i, item)
            }
        }
    }
}

export default class GemInventoryModule extends IModule {
    setup() {
        this.inventory = new Inventory(new Vec2(4, 5))

        const { width, height } = this.inventory.getLocalBounds()
        this.inventory.pivot.x = width
        this.inventory.pivot.y = height
        this.inventory.position.x = Game.renderer.width - 10
        this.inventory.position.y = Game.renderer.height - 10

        Game.uiContainer.addChild(this.inventory)
    }

    close() {
        Game.uiContainer.removeChild(this.inventory)
    }

    addItem(item) {
        this.inventory.addItem(item)
    }
}