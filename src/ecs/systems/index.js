export { default as ECSSystem } from "./system_base"

import HealthSystem from "./health_system"
import PathFollowingAI from "./path_following_ai"
import PhysicsSystem from "./physics_system"
import TransformDisplaySync from "./transform_display_sync"
import TowerControl from "./tower_control"
import CollisionSystem from "./collision_system"
import ClickSetup from "./click_setup"
import DragDropSystem from "./drag_drop_system"

export default [
    HealthSystem,
    TransformDisplaySync,
    PhysicsSystem,
    PathFollowingAI,
    TowerControl,
    CollisionSystem,
    ClickSetup,
    DragDropSystem,
]
