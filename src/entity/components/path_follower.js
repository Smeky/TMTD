import { Component } from "."

export default class PathFollowerComponent extends Component {
    static ComponentName = "PathFollower"
    static Dependencies = { required: ["Movement"] }

    constructor(entity, options) {
        super(entity)

        this.path = [...options.path]
        this.onFinished = options.onFinished || null
    }

    setup() {
        this.shiftPathPosition()
        this.dependencies.Movement.onFinished = this.onMovementFinished
    }
    
    update(delta) {

    }

    shiftPathPosition() {
        this.dependencies.Movement.setTargetPosition(this.path.shift())
    }

    onMovementFinished = () => {
        if (this.path.length === 0 && this.onFinished) {
            this.onFinished(this.entity)
        }
        else {
            this.shiftPathPosition()
        }
    }
}
