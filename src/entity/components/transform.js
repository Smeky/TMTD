import { Vec2 } from "game/core/structs"
import { Component } from "."

export default class TransformComponent extends Component {
    static __Name = "transform"

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
