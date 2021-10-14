export { default as IModule } from "./imodule"
export { default as Scene } from "./scene"
export { default as SceneManager } from "./scene_manager"

export default {
    "Level": {
        modules: [
            "LevelSetupModule",
            "EnemyWaves",
            "BuildMode",
            "TowerBar",
            "TowerOptions",
            "TowerManager",
            "CurrencyDisplay",
            "UserInputModule",
            "GemInventoryModule",
            "DevLevelSetupModules",
        ]
    }
}