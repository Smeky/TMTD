import { Game } from "game/";
import { Vec2 } from "game/graphics";
import { ItemInventory } from "game/ui";
import { IModule } from ".";

export default class GemInventoryModule extends IModule {
    setup() {
        this.inventory = new ItemInventory(new Vec2(4, 5))

        const { width, height } = this.inventory.getLocalBounds()
        this.inventory.pivot.x = width
        this.inventory.pivot.y = height
        this.inventory.position.x = Game.renderer.width
        this.inventory.position.y = Game.renderer.height

        Game.uiContainer.addChild(this.inventory)
    }

    close() {
        Game.uiContainer.removeChild(this.inventory)
    }

    addItem(item) {
        this.inventory.addItem(item)
    }
}