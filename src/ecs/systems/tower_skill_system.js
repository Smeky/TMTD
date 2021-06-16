import { ECSSystem } from "."
import { Entity, filterEntitiesByTags, isEntityInRadius } from ".."
import { Game } from "game/"
import { getEntityAction } from "game/ecs/actions/tower_actions"
import { TowerEffects } from "game/graphics/effects"
import { TowerSkillData } from "game/data"
import LevelLayers from "game/scenes/level/layers"
import { addStatsToComponent } from "../components/stats"

export default class TowerSkillSystem extends ECSSystem {
    static Dependencies = ["transform", "towerSkill", "stats"]

    setupComponents(entity) {
        const { towerSkill, stats } = entity.components
        const skillData = TowerSkillData[towerSkill.skillId]

        addStatsToComponent(skillData.stats, stats)

        towerSkill.action = getEntityAction(skillData.actionId, skillData.actionProps)
        towerSkill.actionCd.total = stats.attackRate || Number.POSITIVE_INFINITY

        if (skillData.effectId) {
            towerSkill.actionEffect = new TowerEffects[skillData.effectId]()
            
            // Todo: LevelLayers shouldn't be used here, so the zIndex should come from elsewhere.. effect data maybe?
            Game.world.addChild(towerSkill.actionEffect, LevelLayers[skillData.effectLayer])
        }
    }

    closeComponents(entity) {
        const { towerSkill } = entity.components

        towerSkill.action = null
        towerSkill.actionCd.reset()

        if (towerSkill.actionEffect && towerSkill.actionEffect.parent) {
            towerSkill.actionEffect.parent.removeChild(towerSkill.actionEffect)
            towerSkill.actionEffect = null
        }
    }

    updateEntity(delta, entity, entities) {
        const { towerSkill } = entity.components
        
        const hadTarget = !!towerSkill.target
        towerSkill.target = this.ensureTowerTarget(entity, entities)

        if (hadTarget && !towerSkill.target) {
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
        const { towerSkill } = entity.components

        if (towerSkill.target && towerSkill.target.isActive() && this.isEnemyInRange(entity, towerSkill.target)) {
            return towerSkill.target
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
        const { towerSkill } = entity.components

        if (towerSkill.actionCd.update(delta)) {
            if (towerSkill.target) {
                towerSkill.actionCd.reset()
                towerSkill.action(entity, towerSkill.target)
                
                if (towerSkill.actionEffect) {
                    towerSkill.actionEffect.start(entity)
                }
            }
        }
    }

    updateTowerEffect(delta, entity) {
        const { towerSkill } = entity.components

        if (towerSkill.actionEffect) {
            towerSkill.actionEffect.update(delta, entity)
        }
    }

    stopTowerEffect(entity) {
        const { towerSkill } = entity.components

        if (towerSkill.actionEffect) {
            towerSkill.actionEffect.stop(entity)
        }
    }

    clearTowerTarget(entity) {
        const { towerSkill } = entity.components
        towerSkill.target = null
    }

    handleDamage(source, target) {
        const sourceStats = source.components.stats
        const targetHealth = target.components.health

        targetHealth.current -= sourceStats.damage
    }
}
