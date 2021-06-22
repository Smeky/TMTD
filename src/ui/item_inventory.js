import { Game } from ".."
import { ItemSlot, Widget } from "."
import { Container, Sprite } from "pixi.js"

export default class ItemInventory extends Widget {
    /**
     * 
     * @param {Vec2} cellCount
     */
    constructor(cellCount) {
        super()

        this.slotContainer = new Container()
        this.slots = this.setupSlots(cellCount)

        const offset = 10
        const { width, height } = this.slotContainer.getLocalBounds()

        const bg = new Sprite(Game.assets.InventoryBg)
        bg.width = width + offset * 2
        bg.height = height + offset * 2
        this.slotContainer.position.set(offset, offset)

        this.addChildAt(bg, 0)
        this.addChild(this.slotContainer)
    }

    setupSlots(cellCount) {
        const slots = []

        for (let y = 0; y < cellCount.y; y++) {
            for (let x = 0; x < cellCount.x; x++) {
                const slot = new ItemSlot()
                const { width, height } = slot.getLocalBounds()

                slot.x = x * (width + 3)
                slot.y = y * (height + 3)

                this.slotContainer.addChild(slot)
                slots.push(slot)
            }
        }

        return slots
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