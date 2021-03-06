import "./style.scss"

import Game from "./game"
import * as pixi from "pixi.js"

const game = new Game()

if (process.env.NODE_ENV === "development") {
    // Expose to global scope
    window.game = game
    window.game.pixi = pixi 
}

console.log(window.game)

game.init()
game.run()