import { IModule } from ".";
import { ItemData } from "game/data";
import { Vec2 } from "game/graphics";

export default class DevLevelSetupModules extends IModule {
    setup() {
        const { GemInventoryModule, TowerManager } = this.scene.modules

        GemInventoryModule.addItem(ItemData[1])
        GemInventoryModule.addItem(ItemData[2])

        TowerManager.buildTower("The Ancient One", new Vec2(170, 130))
        TowerManager.buildTower("The Ancient One", new Vec2(350, 130))
        TowerManager.buildTower("The Ancient One", new Vec2(250, 280))
    }

    close() {

    }
}
