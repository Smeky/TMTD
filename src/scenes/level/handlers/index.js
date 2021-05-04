export { default as EnemyWaves } from "./enemy_waves"
export { default as BuildMode } from "./buildmode"
export { default as TowerBar } from "./towerbar"
export { default as TowerOptions } from "./tower_options"
export { default as TowerManager } from "./tower_manager"
export { default as CurrencyDisplay } from "./currency_display"

export function createHandlersStore(scene, Handlers = []) {
    return Handlers.reduce((acc, Handler) => {
        acc[Handler.Name] = new Handler(scene)
        return acc
    }, {})
}