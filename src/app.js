import React from "react"
import { Sidebar } from "game/sidebar"

import Game from "./game"
import * as pixi from "pixi.js"

export default class App extends React.Component {
    constructor() {
        super()

        this.game = new Game()
        window.game = this.game // Expose to global scope

        if (process.env.NODE_ENV === "development") {
            window.game.pixi = pixi 
            console.log(window.game)
        }
    }

    componentDidMount() {
        this.game.init()
    }

    componentWillUnmount() {
        this.game.close()
    }

    render() {
        return (
            <div id="game">
                <Sidebar />
                <div id="canvas_container"></div>
            </div>
        )
    }
}

