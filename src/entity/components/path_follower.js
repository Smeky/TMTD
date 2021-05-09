import { Component } from "."

export default class PathFollowerComponent extends Component {
    constructor(entity, options) {
        super(entity)

        this.path = [...options.path]
    }

    setup() {
        this.transform = this.entity.ensureComponent("transform")
        this.movement = this.entity.ensureComponent("movement")

        this.shiftPathPosition()

        this.entity.on("movement.finished", this.onMovementFinished)
    }

    close() {
        this.entity.removeListener("movement.finished", this.onMovementFinished)
    }

    update(delta) {

    }

    shiftPathPosition() {
        this.movement.setTargetPosition(this.path.shift())
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
