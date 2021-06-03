import { ECSSystem } from "."
import { filterEntitiesByTags } from ".."

export default class TowerControl extends ECSSystem {
    static Dependencies = ["transform", "tower"]

    updateEntity(delta, entity, entities) {
        const { tower } = entity.components

        tower.actionCd.update(delta)

        if (tower.target && tower.target.isActive()) {
            if (this.isTargetInRange(entity)) {
                this.updateTowerHead(entity)

                if (tower.actionCd.isReady()) {
                    tower.actionCd.reset()
                    tower.action(entity)
                }
            }
            else {
                this.clearTowerTarget(entity)
            }
        }
        else {
            this.findEnemyTarget(entity, entities)
        }
    }

    findEnemyTarget(entity, entities) {
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

        if (closest.enemy) {
            tower.target = closest.enemy
        }
    }

    isTargetInRange(entity) {
        const { transform, tower } = entity.components
        const enemyPos = tower.target.components.transform.position

        return transform.position.distance(enemyPos) <= tower.range
    }

    updateTowerHead(entity) {
        const { transform, tower } = entity.components

        if (tower.target) {
            const targetPos = tower.target.components.transform.position
            tower.headSprite.rotation = transform.position.angle(targetPos) - Math.PI / 2
        }
    }

    clearTowerTarget(entity) {
        const { tower } = entity.components
        tower.target = null
    }
}
