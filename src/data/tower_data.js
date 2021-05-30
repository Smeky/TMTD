import { Vec2 } from "game/graphics"

// Todo: get rid of us, please
const TowerSize = 50 

export default [
    {
        id: 1,
        name: "The Ancient One",
        size: new Vec2(TowerSize, TowerSize),
        stats: {
            attackRate: 0.05,
            damage: 1,
            range: 150,
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
    {
        id: 2,
        name: "Mk Two",
        size: new Vec2(TowerSize, TowerSize),
        stats: {
            attackRate: 1,
            damage: 18,
            range: 250,
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
]