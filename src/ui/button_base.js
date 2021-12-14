import { Container } from "pixi.js"

export default class ButtonBase extends Container {
    States = {
        Resting: "rest",
        Active: "active",
        MouseOver: "mouseover",
        Disabled: "disabled",
    }
    
    constructor(options) {
        super()
        
        this.interactive = true
        this.state = this.States.Resting
        this.options = {
            ...options
        }

        this.on("pointerdown", (event) => {
            event.stopPropagation()
            this.setState(this.States.Active)
        })
        this.on("pointerover", () => {
            if (this.state !== this.States.Active) {
                this.setState(this.States.MouseOver)
            }
        })
        this.on("pointerout", () => {
            if (this.state !== this.States.Active) {
                this.setState(this.States.Resting)
            }
        })
        this.on("pointerup", () => this.setState(this.States.MouseOver))
        this.on("pointerupoutside", () => this.setState(this.States.Resting))
    }

    setState(state) {
        if (this.state !== state) {
            const prevState = this.state
            this.state = state
            this.onStateChange(prevState, this.state)
        }
    }

    onStateChange(prevState, newState) {}
}
