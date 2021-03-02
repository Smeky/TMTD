import "game/style.scss"

import Game from "game/game"
import * as pixi from "pixi.js"
import '@pixi/graphics-extras';

const game = new Game()

if (process.env.NODE_ENV === "development") {
    // Expose to global scope
    window.game = game
    window.game.pixi = pixi 
}

console.log(window.game)

game.init()
game.run()