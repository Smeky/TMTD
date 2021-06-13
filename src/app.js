import React, { useEffect } from "react"

import * as pixi from "pixi.js"
import Game from "./game"

export default function App() {
    if (process.env.NODE_ENV === "development") {
        window.game = Game
        window.game.pixi = pixi
        console.log(window.game)
    }

    useEffect(() => {
        Game.beforeLoad()
        Game.load().then(() => Game.afterLoad())

        return () => {
            Game.close()
        }
    }, [])

    return (
        <div id="game">
            <div id="canvas_container"></div>
        </div>
    )
}
