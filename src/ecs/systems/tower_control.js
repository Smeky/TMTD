import { ECSSystem } from "."
import { Entity, filterEntitiesByTags } from ".."

export default class TowerControl extends ECSSystem {
    static Dependencies = ["transform", "tower"]

    updateEntity(delta, entity, entities) {
        const { tower } = entity.components
        
        const hadTarget = !!tower.target
        tower.target = this.ensureTowerTarget(entity, entities)

        if (hadTarget && !tower.target) {
            this.stopTowerEffect(entity)
        }

        this.updateTowerAction(delta, entity)
        this.updateTowerHead(delta, entity)
        this.updateTowerEffect(delta, entity)
    }

    /**
     * Ensure the tower's target is valid by all requirements, otherwise returns a null
     * @param {*} entity 
     * @param {*} entities 
     * @returns {Entity | null}
     */
    ensureTowerTarget(entity, entities) {
        const { tower } = entity.components

        if (tower.target && tower.target.isActive() && this.isTargetInRange(entity)) {
            return tower.target
        }

        return this.findTowerTarget(entity, entities)
    }

    findTowerTarget(entity, entities) {
        const { transform, tower } = entity.components

        const enemies = entities.filter(filterEntitiesByTags("Enemy"))
        const closest = enemies.reduce((winner, enemy) => {
            const enemyPos = enemy.components.transform.position
            const distance = transform.position.distance(enemyPos)

            if (distance <= tower.range) {
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

    isTargetInRange(entity) {
        const { transform, tower } = entity.components
        const enemyPos = tower.target.components.transform.position

        return transform.position.distance(enemyPos) <= tower.range
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
