import { Component } from "."

export default class OnClickComponent extends Component {
    static ComponentName = "OnClick"

    constructor(entity, options) {
        super(entity)

        this.onClick = options.onClick || (() => {})

        this.entity.interactive = true
        this.entity.on("click", this.onClick)
    }

    close() {
        this.entity.removeListener("click", this.onClick)
    }
}