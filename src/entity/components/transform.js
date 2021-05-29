import { Vec2 } from "game/graphics"
import { Component } from "."

export default class TransformComponent extends Component {
    /**
     * 
     * @param {Entity} entity 
     * @param {object} options 
     * @param {Vec2}   [options.position] [optional] position
     */
    constructor(entity, options) {
        super(entity) 

        this.position = options.position || new Vec2(0, 0)
    }
}
