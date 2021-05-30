export { default as Component } from "./component"

import { TowerBeamAttack, TowerBulletAttack } from "./tower_action"
import CollideableComponent from "./collideable"
import DisplayComponent from "./display"
import HealthComponent from "./health"
import MovementComponent from "./movement"
import OnClickComponent from "./on_click"
import PathFollowerComponent from "./path_follower"
import StatsComponent from "./stats"
import TowerComponent from "./tower"
import TransformComponent from "./transform"

const CmpArray = [
    CollideableComponent,
    DisplayComponent,
    HealthComponent,
    MovementComponent,
    OnClickComponent,
    PathFollowerComponent,
    StatsComponent,
    TowerBeamAttack,
    TowerBulletAttack,
    TowerComponent,
    TransformComponent,
]

export const Components = CmpArray.reduce((acc, Cmp) => {
    acc[Cmp.ComponentName] = Cmp
    return acc
}, {})

export const ComponentNames = CmpArray.reduce((acc, Cmp) => {
    acc[Cmp.ComponentName] = Cmp.ComponentName
    return acc
}, {})
