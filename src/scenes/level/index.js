import { IScene } from "game/scenes"
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

export default class LevelScene extends IScene {
    static Name = "level"
    static Modules = [
        EnemyWaves, BuildMode, TowerBar, TowerOptions, TowerManager, 
        CurrencyDisplay, UserInputModule, LevelSetupModule
    ]

    constructor() {
        super()

        this.Layers = SceneLayers
    }
}