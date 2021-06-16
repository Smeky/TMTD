import "./main.scss"

import React from "react"
import ReactDOM from "react-dom"
import App from "./app"

export { default as Game } from "./game"

ReactDOM.render(
    <App />,
    document.getElementById("root")
)
