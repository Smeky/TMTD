import { Vec2 } from "game/graphics";
import { Container, Sprite } from "pixi.js";
import { IModule } from ".";

export class InventorySlot extends Container {
    constructor(bgTexture) {
        super()

        this.size = new Vec2(bgTexture.width, bgTexture.height)
        this.interactive = true
        this.isPressed = false

        this.highlight = new Sprite(game.assets.InventorySlotHightlight)
        this.highlight.alpha = 0.1
        this.highlight.visible = false

        this.addChild(new Sprite(bgTexture))
        this.addChild(this.highlight)

        this.on("pointerdown", this.onPointerDown)
        this.on("pointerover", this.onPointerOver)
        this.on("pointermove", this.onPointerMove)
        this.on("pointerout", this.onPointerOut)
        this.on("pointerup", this.onPointerUp)
        this.on("pointerupoutside", this.onPointerUp)
    }

    onPointerDown = () => { this.isPressed = true }
    onPointerOver = () => { this.highlight.visible = true }
    onPointerOut = () => { this.highlight.visible = false }
    onPointerUp = () => { this.isPressed = false }
    onPointerMove = () => {
        if (this.isPressed && this.item) {
            const item = this.removeItem()

            game.dragAndDrop.setup({
                sprite: item.icon,
                onDrop: (target) => { 
                    if (target instanceof InventorySlot) {
                        target.setItem(item) 
                    }
                    else {
                        this.setItem(item)
                    }
                }
            })
        }
    }

    setItem(item) {
        this.item = item

        item.icon.width = this.size.x
        item.icon.height = this.size.y
        this.addChild(item.icon)
    }

    removeItem() {
        const item = this.item
        this.item = null
        
        this.removeChild(item.icon)
        return item        
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
        const slotBgTexture = game.assets.InventorySlotBg

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
}

export default class GemInventoryModule extends IModule {
    setup() {
        this.inventory = new Inventory(new Vec2(4, 5))

        const { width, height } = this.inventory.getLocalBounds()
        this.inventory.pivot.x = width
        this.inventory.pivot.y = height
        this.inventory.position.x = game.renderer.width - 10
        this.inventory.position.y = game.renderer.height - 10

        this.inventory.setItem(1, {
            icon: new Sprite(game.assets.IconScorchingRay.texture)
        })

        game.uiContainer.addChild(this.inventory)
    }

    close() {
        game.uiContainer.removeChild(this.inventory)
    }
}