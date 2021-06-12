export { default as LevelLayers } from "./layers"

import { IScene } from "game/scenes"
import { EnemyWaves, BuildMode, TowerBar, TowerOptions, TowerManager, CurrencyDisplay, UserInputModule, LevelSetupModule } from "./modules"

export default class LevelScene extends IScene {
    static Name = "level"
    static Modules = [
        EnemyWaves, BuildMode, TowerBar, TowerOptions, TowerManager, 
        CurrencyDisplay, UserInputModule, LevelSetupModule
    ]
}