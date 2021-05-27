import utils from "game/utils"
import { Cooldown } from "game/core"
import { Vec2, Rect } from "game/graphics"
import { Tile } from "game/core"
import { Sprite } from "pixi.js"

import IModule from "game/scenes/imodule"

export default class EnemyWaves extends IModule {
    static Name = "enemyWaves"

    setup() {
        this.spawnCooldown = new Cooldown(0.6)
        
        this.enemyMeta = {
            spawnCount: 0,
            levelRaise: 10,
            difficulty: 1,
            maxHp: 100,
            maxArmor: 0,
            baseSpeed: 100,
            speed: 100,
            color: 0xffffff,
        }

        game.on("target_killed", this.onTargetKilled)
    }

    close() {
        game.removeListener("target_killed", this.onTargetKilled)
    }

    update(delta) {
        if (this.spawnCooldown.update(delta)) {
            this.spawnCooldown.reset()

            this.createEnemy()
        }
    }

    onTargetKilled = (event) => {
        this.scene.currency(this.scene.currency() + 20)
    }

    getEnemyComponents() {
        return {
            "transform": {
                pos: new Vec2(3 * Tile.Size, 2 * Tile.Size)
            },
            "display": {
                displayObject: new Sprite(utils.createRectTexture(new Rect(0, 0, 16, 16), this.enemyMeta.color)),
            },
            "movement": {
                speed: this.enemyMeta.speed,
            },
            "pathFollower": {
                path: this.scene.path,
            },
            "health": {
                maximum: this.enemyMeta.maxHp,
                armor: this.enemyMeta.maxArmor,
                parent: this.scene.getLayer(50),
            }
        }
    }

    increaseSpawnCount() {
        this.enemyMeta.spawnCount++

        if (this.enemyMeta.entities % this.enemyMeta.levelRaise === 0) {
            this.increaseDifficulty()
        }
    }

    increaseDifficulty() {
        this.enemyMeta.difficulty++
        this.enemyMeta.color *= 0.95

        if (this.enemyMeta.color < 0x000000) {
            this.enemyMeta.color = 0x000000
        }

        this.enemyMeta.maxHp *= 1.1
        this.enemyMeta.maxArmor *= (1 - this.enemyMeta.maxArmor) * 1.1
        this.enemyMeta.speed = this.enemyMeta.baseSpeed * (Math.random() + 0.5)
    }

    // Todo: this should probably be moved to some enemy spawner
    createEnemy() {
        const components = this.getEnemyComponents()
        const entity = this.scene.entitySystem.createEntity(components, "enemy")
        
        this.scene.addChild(entity, this.scene.Layers.TowerBase)
        this.increaseSpawnCount()

        entity.on("path_follower.finished", (entity) => entity.despawn())
        entity.on("entity_health_zero", (entity) => entity.despawn())
    }
}

