import "./style.scss"

import * as pixi from "pixi.js"

pixi.utils.skipHello() // Don't spam the console banner
const app = new pixi.Application({
    width: 1024,
    height: 768,
    antialias: true,
    backgroundColor: 0x313548
})

document.getElementById("app").appendChild(app.view)
