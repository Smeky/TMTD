export {default as Component} from "./component"
import TransformComponent from "./transform"
import DisplayComponent from "./display"
import MovementComponent from "./movement"
import HealthComponent from "./health"
import TowerComponent from "./tower"
import LaserComponent from "./laser"
import { TowerLaserAttack } from "./tower_action"

export default {
    "transform": TransformComponent,
    "display":   DisplayComponent,
    "movement":  MovementComponent,
    "health":    HealthComponent,
    "tower":     TowerComponent,
    "laser":     LaserComponent,

    "towerLaserAttack": TowerLaserAttack,
}
