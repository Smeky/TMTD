import { Vec2 } from "game/graphics"
import { Component } from "."

export default class TransformComponent extends Component {
    /**
     * 
     * @param {Entity} entity 
     * @param {object} options 
     * @param {Vec2}   [options.pos] [optional] position
     */
    constructor(entity, options) {
        super(entity) 

        this.pos = options.pos || new Vec2(0, 0)
    }
}
