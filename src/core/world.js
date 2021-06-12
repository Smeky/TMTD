import { ECSController } from "game/ecs"
import { Grid, Camera } from ".";

export default class World extends Camera {
    constructor(options) {
        super(options)
        
        this.ecs = new ECSController()
        this.grid = new Grid()

        this.addChild(this.grid)
    }

    update(delta) {
        this.ecs.update(delta)
    }
}
