export {default as Component} from "./component"
import TransformComponent from "./transform"
import DisplayComponent from "./display"
import MovementComponent from "./movement"
import HealthComponent from "./health"
import TowerComponent from "./tower"
import StatsComponent from "./stats"
import PathFollowerComponent from "./path_follower"
import OnClickComponent from "./on_click"
import { TowerBeamAttack, TowerBulletAttack } from "./tower_action"

export default {
    "transform": TransformComponent,
    "display":   DisplayComponent,
    "movement":  MovementComponent,
    "health":    HealthComponent,
    "tower":     TowerComponent,
    "stats":     StatsComponent,
    "pathFollower": PathFollowerComponent,
    "onClick":   OnClickComponent,

    "towerBeamAttack": TowerBeamAttack,
    "towerBulletAttack": TowerBulletAttack,
}
