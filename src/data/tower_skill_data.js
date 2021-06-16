
export default {
    "FireBeam": {
        actionId: "InstantDamage",
        effectId: "BeamEffect",
        effectLayer: "Beam",
        stats: {
            damage: 1,
            attackRate: 0.05,
            range: 150,
        }
    },
    "ShootPlasma": {
        actionId: "SpawnProjectile",
        actionProps: {
            projectileId: "SimpleOne",
        },
        stats: {
            attackRate: 1,
            damage: 18,
            range: 250,
        }
    }
}
