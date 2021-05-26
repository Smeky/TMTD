import React, { useEffect } from "react"

import Game from "./game"
import * as pixi from "pixi.js"

export default function App() {
    const game = new Game()
    window.game = game // Expose to global scope

    if (process.env.NODE_ENV === "development") {
        window.game.pixi = pixi 
        console.log(window.game)
    }

    useEffect(() => {
        game.init()

        return () => {
            game.close()
        }
    }, [])

    return (
        <div id="game">
            <div id="canvas_container"></div>
        </div>
    )
}
