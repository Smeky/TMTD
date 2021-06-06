import { Entity } from ".."

/**
 * @param {object} stats
 * @param {Entity} entity
 * 
 * @param {number} stats.health
 * @param {number} stats.speed
 * @param {number} stats.damage
 * @param {number} stats.attackRate
 * @param {number} stats.armor
 */
export default function createStatsComponent(stats, entity) {
    const interfaces = {
        get health() { return entity.components.health.maximum },
        set health(v) { 
            const { health } = entity.components
            const ratio = health.current / health.maximum
            
            health.maximum = v
            health.current = isNaN(ratio) ? v : v * ratio
        },

        get speed() { return entity.components.speed },
        set speed(v) { entity.components.speed = v },
    }

    return Object.keys(stats).reduce((acc, key) => {
        acc[key] = stats[key]
        return acc
    }, interfaces)
}
