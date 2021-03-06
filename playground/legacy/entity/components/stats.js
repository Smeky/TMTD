import { Component } from "."

export const DefaultStats = {
    health: 0,
    shield: 0,
    
    resource: 0,
    resourceRegen: 0,

    damage: 0,
    attackRate: 0,
    range: 0,

    movementSpeed: 0,
}

export default class StatsComponent extends Component {
    static ComponentName = "Stats"

    constructor(entity, options = {}) {
        super(entity)
        
        this.base = { ...options }
        this.current = { ...this.base }
    }
}
