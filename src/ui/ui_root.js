import { Container } from "pixi.js";

export default class UIRoot extends Container {
    constructor() {
        super()

        this.right  = new Container()
        this.bottom = new Container()
        this.left   = new Container()
        this.top    = new Container()
    }
}
