export {default as Component} from "./component"
import TransformComponent from "./transform"
import DisplayComponent from "./display"
import MovementComponent from "./movement"
import HealthComponent from "./health"
import TowerComponent from "./tower"
import StatsComponent from "./stats"
import { TowerLaserAttack } from "./tower_action"

export default {
    "transform": TransformComponent,
    "display":   DisplayComponent,
    "movement":  MovementComponent,
    "health":    HealthComponent,
    "tower":     TowerComponent,
    "stats":     StatsComponent,

    "towerLaserAttack": TowerLaserAttack,
}
