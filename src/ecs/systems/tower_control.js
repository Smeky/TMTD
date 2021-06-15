import { Game } from "game/"
import { TowerActions } from "game/actions"
import { TowerEffects } from "game/graphics/effects"
import { ECSSystem } from "."
import LevelLayers from "game/scenes/level/layers"
import { Entity, filterEntitiesByTags, isEntityInRadius } from ".."

export default class TowerControl extends ECSSystem {
    static Dependencies = ["transform", "towerAction", "stats"]

    setupComponents(entity) {
        const { towerAction, stats } = entity.components
        const actionData = TowerActions[towerAction.actionId]

        towerAction.action = actionData.action
        towerAction.actionCd.total = stats.attackRate || Number.POSITIVE_INFINITY

        if (actionData.effect) {
            towerAction.actionEffect = new TowerEffects[actionData.effect]()
            
            // Todo: LevelLayers shouldn't be used here, so the zIndex should come from elsewhere.. effect data maybe?
            Game.world.addChild(towerAction.actionEffect, LevelLayers[actionData.effectLayer])
        }
    }

    closeComponents(entity) {
        const { towerAction } = entity.components

        towerAction.action = null
        towerAction.actionCd.reset()

        if (towerAction.actionEffect && towerAction.actionEffect.parent) {
            towerAction.actionEffect.parent.removeChild(towerAction.actionEffect)
            towerAction.actionEffect = null
        }
    }

    updateEntity(delta, entity, entities) {
        const { towerAction } = entity.components
        
        const hadTarget = !!towerAction.target
        towerAction.target = this.ensureTowerTarget(entity, entities)

        if (hadTarget && !towerAction.target) {
            this.stopTowerEffect(entity)
        }

        this.updateTowerAction(delta, entity)
        this.updateTowerEffect(delta, entity)
    }

    /**
     * Ensure the tower's target is valid by all requirements, otherwise returns a null
     * @param {*} entity 
     * @param {*} entities 
     * @returns {Entity | null}
     */
    ensureTowerTarget(entity, entities) {
        const { towerAction } = entity.components

        if (towerAction.target && towerAction.target.isActive() && this.isEnemyInRange(entity, towerAction.target)) {
            return towerAction.target
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

    updateTowerAction(delta, entity) {
        const { towerAction } = entity.components

        if (towerAction.actionCd.update(delta)) {
            if (towerAction.target) {
                towerAction.actionCd.reset()
                towerAction.action(entity, towerAction.target)
                
                if (towerAction.actionEffect) {
                    towerAction.actionEffect.start(entity)
                }
            }
        }
    }

    updateTowerEffect(delta, entity) {
        const { towerAction } = entity.components

        if (towerAction.actionEffect) {
            towerAction.actionEffect.update(delta, entity)
        }
    }

    stopTowerEffect(entity) {
        const { towerAction } = entity.components

        if (towerAction.actionEffect) {
            towerAction.actionEffect.stop(entity)
        }
    }

    clearTowerTarget(entity) {
        const { towerAction } = entity.components
        towerAction.target = null
    }

    handleDamage(source, target) {
        const sourceStats = source.components.stats
        const targetHealth = target.components.health

        targetHealth.current -= sourceStats.damage
    }
}
