import { ECSSystem } from "."
import { Entity, filterEntitiesByTags, isEntityInRadius } from ".."
import { Game } from "game/"
import { getEntityAction } from "game/ecs/actions/tower_actions"
import { TowerEffects } from "game/graphics/effects"
import { TowerSkillData } from "game/data"
import { addStatsToComponent, removeStatsFromComponent } from "../components/stats"
import { Vec2 } from "game/graphics"

export default class TowerSkillSystem extends ECSSystem {
    static Dependencies = ["towerSkill", "tower", "transform", "stats"]

    setupComponents(entity) {
        const { towerSkill, stats } = entity.components
        const skillData = TowerSkillData[towerSkill.skillId]

        addStatsToComponent(skillData.stats, stats)

        towerSkill.action = getEntityAction(skillData.actionId, skillData.actionProps)
        towerSkill.actionCd.total = stats.attackRate || Number.POSITIVE_INFINITY

        if (skillData.effectId) {
            towerSkill.actionEffect = new TowerEffects[skillData.effectId]()
            
            // Todo: LayerList shouldn't be used here, so the zIndex should come from elsewhere.. effect data maybe?
            Game.world.addChild(towerSkill.actionEffect, skillData.effectLayer)
        }
    }

    closeComponents(entity) {
        const { towerSkill, stats } = entity.components
        const skillData = TowerSkillData[towerSkill.skillId]

        removeStatsFromComponent(skillData.stats, stats)

        towerSkill.skillId = null
        towerSkill.action = null
        towerSkill.actionCd.reset()

        if (towerSkill.actionEffect && towerSkill.actionEffect.parent) {
            towerSkill.actionEffect.parent.removeChild(towerSkill.actionEffect)
            towerSkill.actionEffect = null
        }
    }

    updateEntity(delta, entity, entities) {
        const { tower } = entity.components
        
        if (tower.hadTarget && !tower.target) {
            this.stopTowerEffect(entity)
        }

        // this.updateTowerHead(delta, entity)
        this.updateTowerAction(delta, entity)
        this.updateTowerEffect(delta, entity)
    }

    updateTowerAction(delta, entity) {
        const { tower, towerSkill } = entity.components

        if (towerSkill.actionCd.update(delta)) {
            if (tower.target) {
                towerSkill.actionCd.reset()
                towerSkill.action(entity, tower.target)
                
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
}
