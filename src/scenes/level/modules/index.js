export { default as EnemyWaves } from "./enemy_waves"
export { default as BuildMode } from "./buildmode"
export { default as TowerBar } from "./towerbar"
export { default as TowerOptions } from "./tower_options"
export { default as TowerManager } from "./tower_manager"
export { default as CurrencyDisplay } from "./currency_display"

export function createModulesStore(scene, Modules = []) {
    return Modules.reduce((acc, Module) => {
        acc[Module.Name] = new Module(scene)
        return acc
    }, {})
}