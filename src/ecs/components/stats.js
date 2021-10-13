import { Entity } from ".."

/**
 * @param {object} stats
 * @param {Entity} entity
 * 
 * @param {number} stats.health
 * @param {number} stats.speed
 * @param {number} stats.damage
 * @param {number} stats.attackRate
 * @param {number} stats.range
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

/**
 * Mutates the component by adding (and defining when necessary) stats 
 * @param {Object} obj { statName: statValue }
 * @param {Object} component Stats component
 */
export function addStatsToComponent(obj, component) {
    for (const [stat, value] of Object.entries(obj)) {
        // Define the stat if the component doesn't have it yet
        if (!component.hasOwnProperty(stat)) {
            component[stat] = 0
        }

        component[stat] += value
    }
}

/**
 * Mutates the component by removing stats 
 * @param {Object} obj { statName: statValue }
 * @param {Object} component Stats component
 */
export function removeStatsFromComponent(obj, component) {
    for (const [stat, value] of Object.entries(obj)) {
        // Define the stat if the component doesn't have it yet
        if (!component.hasOwnProperty(stat)) {
            component[stat] = 0
        }

        component[stat] -= value
    }
}
