import { ECSSystem } from ".";
import { filterEntitiesByTags, isEntityInRadius } from "..";

export default class TowerSystem extends ECSSystem {
    static Dependencies = ["tower", "transform", "stats"]

    setupComponents(entity) {

    }

    closeComponents(entity) {

    }

    updateEntity(delta, entity, entities) {
        const { tower } = entity.components
        
        tower.hadTarget = !!tower.target
        tower.target = this.ensureTowerTarget(entity, entities)

        this.updateTowerHead(delta, entity)
    }

    updateTowerHead(delta, entity) {
        const { tower, transform } = entity.components

        if (tower.target) {
            const targetPos = tower.target.components.transform.position
            tower.headSprite.rotation = transform.position.angle(targetPos)
        }
    }

    /**
     * Ensure the tower's target is valid by all requirements, otherwise returns a null
     * @param {*} entity 
     * @param {*} entities 
     * @returns {Entity | null}
     */
    ensureTowerTarget(entity, entities) {
        const { tower } = entity.components

        if (tower.target && tower.target.isActive() && this.isEnemyInRange(entity, tower.target)) {
            return tower.target
        }

        return this.findTowerTarget(entity, entities)
    }

    isEnemyInRange(towerEntity, enemyEntity) {
        const { transform, stats } = towerEntity.components
        return isEntityInRadius(enemyEntity, transform.position, stats.range)
    }

    findTowerTarget(entity, entities) {
        const { transform, stats } = entity.components

        const enemies = entities.filter(filterEntitiesByTags("Enemy"))
        const closest = enemies.reduce((winner, enemy) => {
            const enemyPos = enemy.components.transform.position
            const distance = transform.position.distance(enemyPos)

            if (distance <= stats.range) {
                if (!winner.enemy) {
                    winner.enemy = enemy
                    winner.distance = distance
                }
                else {
                    if (distance < winner.distance) {
                        winner.enemy = enemy
                        winner.distance = distance
                    }
                }
            }

            return winner
        }, { enemy: null, distance: null })

        return closest.enemy
    }

    clearTowerTarget(entity) {
        const { tower } = entity.components
        tower.target = null
    }
}
