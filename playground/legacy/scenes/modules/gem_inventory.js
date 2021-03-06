import { Game } from "game/";
import { Vec2 } from "game/graphics";
import { ItemInventory } from "game/ui";
import { IModule } from "../../../../src/scenes/modules";

export default class GemInventoryModule extends IModule {
    setup() {
        this.inventory = new ItemInventory(new Vec2(4, 5))

        const { width, height } = this.inventory.getLocalBounds()
        this.inventory.pivot.x = width
        this.inventory.pivot.y = height
        this.inventory.position.x = Game.renderer.width
        this.inventory.position.y = Game.renderer.height

        Game.ui.addChild(this.inventory)
    }

    close() {
        Game.ui.removeChild(this.inventory)
    }

    addItem(item) {
        this.inventory.addItem(item)
    }
}