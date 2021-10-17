import { IModule } from ".";
import { Vec2 } from "game/graphics";

export default class DevLevelSetupModules extends IModule {
    setup() {
        const { TowerManager } = this.scene.modules

        TowerManager.buildTower("The Ancient One", new Vec2(170, 130))
        TowerManager.buildTower("The Ancient One", new Vec2(350, 130))
        TowerManager.buildTower("The Ancient One", new Vec2(250, 280))
    }

    close() {

    }
}
