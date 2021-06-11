import { SceneBase } from "game/scenes"
import { Observable } from "game/core"
import { EnemyWaves, BuildMode, TowerBar, TowerOptions, TowerManager, CurrencyDisplay, UserInputModule, LevelSetupModule } from "./modules"

const SceneLayers = {
    Grid: 10,

    TowerBase: 15,
    EnemyBase: 15,
    TowerSelection: 18,

    Bullets: 20,
    Beams: 21,

    BuildmodeTiles: 50,
    BuildmodeHighlight: 51,
    
    EnemyHealthBar: 53,
    TowerOptions: 55,
}

export default class LevelScene extends SceneBase {
    static Name = "level"
    static Modules = [
        EnemyWaves, BuildMode, TowerBar, TowerOptions, TowerManager, 
        CurrencyDisplay, UserInputModule, LevelSetupModule
    ]

    constructor() {
        super()

        this.Layers = SceneLayers

        this.currency = new Observable(0)
        this.currency.subscribe(value => game.emit("currency_changed", value))
    }

    update(delta) {
        if (!this.started) return

        for (const module of this.moduleList) {
            module.update(delta)
        }
    }
}