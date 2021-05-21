import "./main.scss"
import "normalize.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css"

import React from "react"
import ReactDOM from "react-dom"
import App from "./app"

import { FocusStyleManager } from "@blueprintjs/core";
FocusStyleManager.onlyShowFocusOnTabs();

ReactDOM.render(
    <App />,
    document.getElementById("root")
)
