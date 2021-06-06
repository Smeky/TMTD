import { ECSSystem } from "."
import { Entity, filterEntitiesByTags, isEntityInRadius } from ".."

export default class TowerControl extends ECSSystem {
    static Dependencies = ["transform", "tower", "stats"]

    setupEntity(entity) {
        const { tower, stats } = entity.components

        tower.actionCd.total = stats.attackRate || Number.POSITIVE_INFINITY
    }

    updateEntity(delta, entity, entities) {
        const { tower } = entity.components
        
        const hadTarget = !!tower.target
        tower.target = this.ensureTowerTarget(entity, entities)

        if (hadTarget && !tower.target) {
            this.stopTowerEffect(entity)
        }

        this.updateTowerHead(delta, entity)
        this.updateTowerAction(delta, entity)
        this.updateTowerEffect(delta, entity)
    }

    closeEntity(entity) {
        const { tower } = entity.components

        if (tower.actionEffect && tower.actionEffect.parent) {
            tower.actionEffect.parent.removeChild(tower.actionEffect)
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

    isEnemyInRange(eTower, eEnemy) {
        const { transform, stats } = eTower.components
        return isEntityInRadius(eEnemy, transform.position, stats.range)
    }

    updateTowerHead(delta, entity) {
        const { transform, tower } = entity.components

        if (tower.target) {
            const targetPos = tower.target.components.transform.position
            tower.headSprite.rotation = transform.position.angle(targetPos) - Math.PI / 2
        }
    }

    updateTowerAction(delta, entity) {
        const { tower } = entity.components

        if (tower.actionCd.update(delta)) {
            if (tower.target) {
                tower.actionCd.reset()
                tower.action(entity)
                
                if (tower.actionEffect) {
                    tower.actionEffect.start(entity)
                }
            }
        }
    }

    updateTowerEffect(delta, entity) {
        const { tower } = entity.components

        if (tower.actionEffect) {
            tower.actionEffect.update(delta, entity)
        }
    }

    stopTowerEffect(entity) {
        const { tower } = entity.components

        if (tower.actionEffect) {
            tower.actionEffect.stop(entity)
        }
    }

    clearTowerTarget(entity) {
        const { tower } = entity.components
        tower.target = null
    }
}
