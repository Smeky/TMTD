import { BulletData } from "game/data"
import { Vec2 } from "game/graphics"
import { Sprite } from "pixi.js"
import { Game } from "../.."
import { getTowerHeadEndPosition } from "../ecs_utils"

function instantDamage(source, target) {
    // Todo: instantDamage - simple, temporary, ugh :D 
    const sourceStats = source.components.stats
    const targetHealth = target.components.health

    targetHealth.current -= sourceStats.damage   
}

function getBulletComponents({ data, position, rotation, range, source }) {
    const sprite = new Sprite(Game.assets[data.textureId])
    const velocity = new Vec2(data.speed).velocity(rotation)

    sprite.anchor.set(0.5, 0.5)

    Game.world.addChild(sprite, "projectiles")

    return {
        "transform": { position, rotation },
        "velocity": { velocity },
        "display": { displayObject: sprite },
        "bullet": { source },
        "collideable": { 
            type: "active",
            solid: false,
            radius: sprite.width / 2,
            onCollision: (entity, target) => {
                const { bullet } = entity.components
                instantDamage(bullet.source, target)

                entity.despawn()
            }
        },
        "travelLimit": {
            maxDistance: range * 1.5,
            onLimitReached: (entity) => entity.despawn()
        },
    }
}

/**
 * 
 * @param {object} properties
 * @param {string} properties.projectileId
 * @returns 
 */
function spawnProjectile({ projectileId }) {
    const data = BulletData[projectileId]

    return (source, target) => {
        const { transform: sourceTransform, stats } = source.components
        const { transform: targetTransform } = target.components

        const angle = sourceTransform.position.angle(targetTransform.position)

        const components = getBulletComponents({
            data,
            position: getTowerHeadEndPosition(source),
            rotation: angle,
            range: stats.range,
            source
        })

        Game.world.ecs.createEntity(components, "Bullet")
    }
}

export function getEntityAction(actionId, actionProps) {
    switch(actionId) {
        case "InstantDamage": return instantDamage;
        case "SpawnProjectile": return spawnProjectile(actionProps);
    }
}
