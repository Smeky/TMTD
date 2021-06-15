function instantDamage(source, target) {
    // Todo: instantDamage - simple, temporary, ugh :D 
    const sourceStats = source.components.stats
    const targetHealth = target.components.health

    targetHealth.current -= sourceStats.damage   
}

export default {
    "FireBeam": {
        action: instantDamage,
        effect: "BeamEffect",
        effectLayer: "Beam",
    }
}
