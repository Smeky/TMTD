
export default {
    "The Ancient One": {
        textureId: "TowerBase1",
        head: {
            textureId: "TowerHead1",
            anchor: { x: 0.2, y: 0.5 }
        },
        stats: {        // Todo: change stats somehow.. Actions should have CDs, not attackRate. (AR should modify CDs of attacks or something)
            damage: 1,
            attackRate: 0.05,
            range: 150,
        },
        actions: [
            {
                temp: "FireBeam",
                actionId: "InstantDamage",
                effectId: "BeamEffect",
                effectLayer: "lasers",
            },
        ]
    },
    "DevGunnerTower": {
        textureId: "TowerBase2",
        head: {
            textureId: "TowerHead2",
            anchor: { x: 0.2, y: 0.5 }
        },
        stats: {
            damage: 18,
            attackRate: 0.5,
            range: 250,
        },
        actions: [
            {
                temp: "ShootPlasma",
                actionId: "SpawnProjectile",
                actionProps: {
                    projectileId: "SimpleOne",
                },
            }
        ]
    },
}
