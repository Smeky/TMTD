import IModule from "game/scenes/imodule"
import { Cooldown } from "game/core"
import { EnemyData } from "game/data"
import LevelLayers from "game/scenes/level/layers"
import { Sprite } from "pixi.js"


export default class EnemyWaves extends IModule {
    static Name = "enemyWaves"

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
        const sprite = new Sprite(game.assets[textureId])
        sprite.anchor.set(0.5, 0.5)

        const components = this.getEnemyComponents(enemyData, sprite)
        game.world.ecs.createEntity(components, "Enemy")
        
        this.scene.addChild(sprite, LevelLayers.EnemyBase)
    }

    getEnemyComponents(enemyData, sprite) {
        const { speed, health } = enemyData

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
                container: this.scene.getLayer(LevelLayers.EnemyHealthBar),
                onZeroHealth: (entity) => {
                    entity.despawn()
                    game.currency(game.currency() + 20)
                }
            },
            "stats": {
                speed,
                health,
            }
        }
    }

    // getEnemyComponents(enemyData) {
        // const { textureId, speed, health } = enemyData
        // const texture = game.assets[textureId]

    //     return {
    //         "Transform": {
    //             position: new Vec2(3 * Tile.Size, 2 * Tile.Size)
    //         },
    //         "Display": {
    //             displayObject: new Sprite(texture),
    //         },
    //         "Movement": {
    //             speed
    //         },
    //         "PathFollower": {
    //             path: this.scene.path,
    //             onFinished: (entity) => entity.despawn()
    //         },
    //         "Health": {
    //             maximum: health,
    //             parent: this.scene.getLayer(LevelLayers.EnemyHealthBar),
    //             onZeroHealth: (entity) => {
    //                 game.emit("enemy_killed", entity.id)
    //                 entity.despawn()
    //             }
    //         },
    //         "Stats": {
    //             movementSpeed: speed,
                
    //         },
    //         "Collideable": {
    //             radius: Math.max(texture.width, texture.height) / 2,
    //             static: true,
    //         }
    //     }
    // }
}

