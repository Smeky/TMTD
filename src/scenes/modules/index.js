export { IModule } from ".."

import EnemyWaves from "./enemy_waves"
import BuildMode from "./buildmode"
import TowerBar from "./towerbar"
import FunctionsBar from "./functions_bar"
import TowerOptions from "./tower_options"
import TowerManager from "./tower_manager"
import CurrencyDisplay from "./currency_display"
import UserInputModule from "./user_input"
import LevelSetupModule from "./level_setup"
import DevLevelSetupModules from "./devlevel_setup"

export const Modules = {
    EnemyWaves,
    BuildMode,
    TowerBar,
    FunctionsBar,
    TowerOptions,
    TowerManager,
    CurrencyDisplay,
    UserInputModule,
    LevelSetupModule,
    DevLevelSetupModules,
}

export function createModulesStore(scene, Modules = []) {
    return Modules.reduce((acc, Module) => {
        try {
            const instance = new Module(scene)
            acc[instance.constructor.name] = instance
        }
        catch(error) {
            console.error(`Failed to initialize scene module`)
            console.error(error)
        }

        return acc
    }, {})
}
