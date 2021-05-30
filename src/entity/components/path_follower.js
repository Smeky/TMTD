import { Component } from "."

export default class PathFollowerComponent extends Component {
    static ComponentName = "PathFollower"
    static Dependencies = { required: ["Movement"] }

    constructor(entity, options) {
        super(entity)

        this.path = [...options.path]
    }

    setup() {
        this.shiftPathPosition()
        this.entity.on("movement.finished", this.onMovementFinished)
    }

    close() {
        this.entity.removeListener("movement.finished", this.onMovementFinished)
    }

    update(delta) {

    }

    shiftPathPosition() {
        this.dependencies.Movement.setTargetPosition(this.path.shift())
    }

    onMovementFinished = () => {
        if (this.path.length === 0) {
            this.entity.emit("path_follower.finished")
        }
        else {
            this.shiftPathPosition()
        }
    }
}
