import { Cooldown, Tile } from "game/core"
import { Vec2 } from "game/graphics"
import { EnemyData } from "game/data"
import { Sprite } from "pixi.js"

import IModule from "game/scenes/imodule"

export default class EnemyWaves extends IModule {
    static Name = "enemyWaves"

    setup() {
        this.spawnCooldown = new Cooldown(1.0)

        this.sentWaveCount = 0
        this.baseWeight = 100

        this.waves = []
        this.addWave()

        game.on("enemy_killed", this.onEnemyKilled)
    }

    close() {
        game.removeListener("enemy_killed", this.onEnemyKilled)
    }

    onEnemyKilled = (entityId) => {
        this.scene.currency(this.scene.currency() + 20)
    }

    update(delta) {
        this.spawnCooldown.update(delta)

        if (this.waves.length > 0) {
            const wave = this.waves[0]

            if (this.spawnCooldown.isReady()) {
                this.createEnemy(wave.enemyData)
                this.spawnCooldown.reset()

                wave.weight -= wave.enemyData.weight

                if (wave.weight < wave.enemyData.weight) {
                    this.waves = this.waves.slice(1)
                    this.handleWaveFinished()
                }
            }
        }
    }

    handleWaveFinished() {
        console.log(`Wave ${this.sentWaveCount + 1} finished spawning`)

        this.sentWaveCount++
        this.spawnCooldown.total = Math.max(1.0 - this.sentWaveCount / 100, 0.1)

        this.addWave()
    }

    addWave() {
        const enemyIds = Object.keys(EnemyData)
        const enemyDataId = enemyIds[this.sentWaveCount % enemyIds.length]
        const enemyData = EnemyData[enemyDataId]
        const difficulty = this.sentWaveCount

        this.waves.push({
            weight: this.baseWeight * (1 + 0.2 * (difficulty)),
            enemyData: {
                ...enemyData,
                health: enemyData.health * (1 + 0.2 * (difficulty)),
                speed: enemyData.speed * (1 + 0.05 * (difficulty)),
            }
        })
    }

    createEnemy(enemyData) {
        const components = this.getEnemyComponents(enemyData)
        const entity = this.scene.entitySystem.createEntity(components, "enemy")
        
        this.scene.addChild(entity, this.scene.Layers.TowerBase)
    }

    getEnemyComponents(enemyData) {
        const { textureId, speed, health } = enemyData
        const texture = game.assets[textureId]

        return {
            "Transform": {
                position: new Vec2(3 * Tile.Size, 2 * Tile.Size)
            },
            "Display": {
                displayObject: new Sprite(texture),
            },
            "Movement": {
                useStatsComponent: {
                    speed: "movementSpeed"
                }
            },
            "PathFollower": {
                path: this.scene.path,
                onFinished: (entity) => entity.despawn()
            },
            "Health": {
                maximum: health,
                parent: this.scene.getLayer(this.scene.Layers.EnemyHealthBar),
                onZeroHealth: (entity) => {
                    game.emit("enemy_killed", entity.id)
                    entity.despawn()
                }
            },
            "Stats": {
                movementSpeed: speed,
                
            },
            "Collideable": {
                radius: Math.max(texture.width, texture.height) / 2,
                static: true,
            }
        }
    }
}

