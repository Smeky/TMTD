import { Cooldown } from "game/core";
import { Vec2 } from "game/graphics";
import createStatsComponent from "./stats"

export default {
    "transform": function({ position, rotation, scale }) {
        return {
            position: new Vec2(position ?? 0),
            rotation: rotation ?? 0,
            scale: new Vec2(scale ?? 1),
        }
    },
    "velocity": function({ velocity }) {
        return new Vec2(velocity ?? 0) // copy the values so we don't mutate args
    },
    "display": function({ displayObject }) {
        return displayObject ?? null
    },
    "path": function({ points = [], onFinished }) {
        return {
            points: [...points],
            onFinished,
        }
    },
    "speed": function({ speed }) {
        return speed ?? 0
    },
    "health": function({ maximum, current, container, onZeroHealth }) {
        return {
            maximum: maximum ?? 0, 
            current: current ?? maximum, 
            container,
            onZeroHealth,
            sprite: null
        }
    },
    "tower": function({ headSprite, action, actionEffect }) {
        return {
            headSprite,
            target: null,
            action,
            actionCd: new Cooldown(),
            actionEffect,
        }
    },
    "travelLimit": function({ maxDistance, onLimitReached }) {
        return {
            maxDistance,
            onLimitReached,
            traveledDistance: 0,
        }
    },
    "collideable": function({ type, solid, radius, onCollision }) {
        return {
            type: type ?? "passive",
            solid: solid ?? false,
            radius: radius ?? 0,
            onCollision,
        }
    },
    "clickable": function({ onClick }) {
        return {
            onClick
        }
    },
    "bullet": function({ source }) {
        return { source }
    },
    "stats": createStatsComponent
}
