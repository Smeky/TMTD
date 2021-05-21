import React from "react"
import { Sidebar } from "game/sidebar"

import Game from "./game"
import * as pixi from "pixi.js"

export default class App extends React.Component {
    constructor() {
        super()

        this.game = new Game()

        if (process.env.NODE_ENV === "development") {
            // Expose to global scope
            window.game = this.game
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

