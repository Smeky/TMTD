import "./style.scss"

import Game from "./game"

const game = new Game(app)
window.game = game // Expose the game to global scope

console.log(window.game)

game.init()
game.run()