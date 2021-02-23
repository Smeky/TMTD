export {default as Component} from "./component"
import TransformComponent from "./transform"
import DisplayComponent from "./display"
import MovementComponent from "./movement"
import HealthComponent from "./health"
import TowerComponent from "./tower"
import LaserComponent from "./laser"

export default {
    [TransformComponent.__Name]: TransformComponent,
    [DisplayComponent.__Name]: DisplayComponent,
    [MovementComponent.__Name]: MovementComponent,
    [HealthComponent.__Name]: HealthComponent,
    [TowerComponent.__Name]: TowerComponent,
    [LaserComponent.__Name]: LaserComponent,
}