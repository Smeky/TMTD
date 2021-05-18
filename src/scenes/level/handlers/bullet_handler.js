import { Vec2 } from "game/graphics"
import IHandler from "game/scenes/ihandler"
import { Container, Sprite } from "pixi.js"

export default class BulletHandler extends IHandler {
    static Name = "bulletHandler"

    setup() {
        this.container = new Container()

        game.camera.addChild(this.container, 20)

        game.on("create_bullet", this.onCreateBullet)
    }
    
    close() {
        game.camera.removeChild(this.container)

        game.removeListener("create_bullet", this.onCreateBullet)
    }

    onCreateBullet = (event) => {
        const { texture, source, pos, angle, speed, range } = event

        const components = {
            "transform": {
                pos
            },
            "display": {
                displayObject: new Sprite(texture),
                parent: this.container,
            },
            "movement": {
                speed,
                angle,
                maxDistance: range,
                enableFacingDirection: true,
            },
        }

        const entities = this.scene.entities

        const entity = entities.createEntity(components)
        entity.on("movement.finished", (entity) => entity.despawn())
    }
}
