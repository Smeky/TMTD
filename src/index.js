import "game/style.scss"

import Game from "game/game"

const game = new Game()
window.game = game // Expose the game to global scope

console.log(window.game)

game.init()
game.run()