import { IModule } from "."
import { Cooldown } from "game/core"
import { EnemyData } from "game/data"
import { Sprite } from "pixi.js"
import { Game } from "game/"


export default class EnemyWaves extends IModule {
    setup() {
        this.spawnCooldown = new Cooldown(1.0)

        this.sentWaveCount = 0
        this.baseWeight = 100

        this.waves = []
        this.addWave()
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
        const { textureId } = enemyData
        const sprite = new Sprite(Game.assets[textureId])
        sprite.anchor.set(0.5, 0.5)

        const components = this.setupEnemyComponents(enemyData, sprite)
        Game.world.ecs.createEntity(components, "Enemy")
        
        Game.world.addChild(sprite, "enemy-ground")
    }

    setupEnemyComponents(enemyData, sprite) {
        const { speed, health, weight } = enemyData

        return {
            "transform": { position: this.scene.path[0] },
            "velocity": {},
            "speed": {},
            "display": { displayObject: sprite },
            "collideable": { 
                type: "passive",
                solid: true,
                radius: sprite.width / 2
            },
            "path": { 
                points: this.scene.path,
                onFinished: (entity) => entity.despawn(),
            },
            "health": {
                container: Game.world.getLayer("enemy-health"),
                onZeroHealth: (entity) => {
                    entity.despawn()
                    this.handleEnemyDeath(weight)
                }
            },
            "stats": {
                speed,
                health,
            }
        }
    }

    handleEnemyDeath(weight) {
        Game.stores.base.update((state) => {
            return {
                currency: state.currency + parseInt(weight / 10)
            }
        })
    }
}
