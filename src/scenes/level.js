import {EntityHandler} from "game/entities"
import Scene from "game/scenes/scene"
import { Vec2 } from "../core/structs"
import * as cmps from "game/entities/components"
import * as pixi from "pixi.js"
import utils from "game/utils"

export default class LevelScene extends Scene {
    constructor() {
        super("level")

        this.inputProxy = game.input.getProxy()
        this.entityHandler = new EntityHandler()

        // Temporary stuff for fun.. :)
        const texture = new pixi.Texture.from("media/tile.png")
        const count = 100

        for (let i = 0; i < count; i++) {
            const entity = this.entityHandler.createEntity()
            entity._radius = (i / count) * (Math.PI * 2)

            const spriteCmp = entity.addComponent(new cmps.SpriteComponent(texture))
            spriteCmp.sprite.scale.set(2, 2)
            
            const pos = new Vec2(
                Math.sin(entity._radius) * 100,
                Math.cos(entity._radius) * 100,
            )

            entity.addComponent(new cmps.TransformComponent(pos))
            entity.init()

            this.sceneContainer.addChild(entity)
        }
    }
    
    close() {
        this.inputProxy.close()
    }

    update(delta) {
        const {entities} = this.entityHandler

        for (const entity of entities) {
            entity._radius = (entity._radius + 1 * delta) % (Math.PI * 2)

            const transformCmp = entity.getComponent("transform") 
            transformCmp.pos.x = (Math.sin(entity._radius) * 100) * (250 * delta)
            transformCmp.pos.y = (Math.cos(entity._radius) * 100) * (100 * delta)

            const spriteCmp = entity.getComponent("sprite")
            const sin = (Math.cos(entity._radius) + 1) / 2
            const red = Math.round(sin * 255)
            
            spriteCmp.sprite.tint = utils.stringColorToHex(utils.rgbColorToString(red))
            
        }

        this.entityHandler.update(delta)
    }
}