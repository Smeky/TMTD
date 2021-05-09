import IHandler from "game/scenes/handler"
import { Container, Sprite } from "pixi.js"

export default class BulletHandler extends IHandler {
    static Name = "bulletHandler"

    init() {
        this.container = new Container()

        game.camera.addChild(this.container, 20)

        game.on("create_bullet", this.onCreateBullet)
    }
    
    close() {
        game.camera.removeChild(this.container)

        game.removeListener("create_bullet", this.onCreateBullet)
    }

    onCreateBullet = (event) => {
        const { texture, source, pos, direction, velocity, range } = event

        const components = {
            "transform": {
                pos
            },
            "display": {
                displayObject: new Sprite(texture),
                parent: this.container,
            },
            "movement": {
                speed: velocity,
                angle: direction,
                maxDistance: range,
            },
        }

        const entities = this.scene.entities

        const entity = entities.createEntity(components)
        entity.on("entity_movement_finished", () => entities.removeEntity(entity.id))
    }
}
