export { IModule } from ".."

import EnemyWaves from "./enemy_waves"
import BuildMode from "./buildmode"
import TowerBar from "./towerbar"
import TowerOptions from "./tower_options"
import TowerManager from "./tower_manager"
import CurrencyDisplay from "./currency_display"
import UserInputModule from "./user_input"
import LevelSetupModule from "./level_setup"

export const Modules = {
    EnemyWaves,
    BuildMode,
    TowerBar,
    TowerOptions,
    TowerManager,
    CurrencyDisplay,
    UserInputModule,
    LevelSetupModule,
}

export function createModulesStore(scene, Modules = []) {
    return Modules.reduce((acc, Module) => {
        const instance = new Module(scene)
        acc[instance.constructor.name] = instance

        return acc
    }, {})
}
