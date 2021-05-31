import { Vec2 } from "game/graphics"

export default {
    "Beam Turret": {
        stats: {
            base: {
                attackRate: 0.05,
                damage: 1,
                range: 150,
            },
            perLevelMultiplier: {
                damage: 1.05,   // 5%
                range: 1.05,   // 5%
            },
        },
        action: {
            type: "direct_damage",
            component: "TowerBeamAttack",
        },
        base: {
            textureId: "TowerBase1",
        },
        head: {
            textureId: "TowerHead1",
            position: new Vec2(0.5), // relative to center
            pivot: new Vec2(4, 6),
        }
    },
    "Bullet Turret": {
        stats: {
            base: {
                attackRate: 1,
                damage: 18,
                range: 250,
            },
            perLevelMultiplier: {
                attackRate: 0.95,   
                damage: 1.05,
            },
        },
        action: {
            type: "create_bullet",
            component: "TowerBulletAttack",
        },
        base: {
            textureId: "TowerBase2",
        },
        head: {
            textureId: "TowerHead2",
            position: new Vec2(0.5), // relative to center
            pivot: new Vec2(4, 6),
        }
    },
}
