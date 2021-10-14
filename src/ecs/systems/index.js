export { default as ECSSystem } from "./system_base"

import HealthSystem from "./health_system"
import PathFollowingAI from "./path_following_ai"
import PhysicsSystem from "./physics_system"
import TransformDisplaySync from "./transform_display_sync"
import TowerSystem from "./tower_system"
import TowerSkillSystem from "./tower_skill_system"
import CollisionSystem from "./collision_system"
import ClickSetup from "./click_setup"
import SocketableSystem from "./socketable_system"

export default [
    HealthSystem,
    TransformDisplaySync,
    PhysicsSystem,
    PathFollowingAI,
    TowerSystem,
    TowerSkillSystem,
    CollisionSystem,
    ClickSetup,
    SocketableSystem,
]
