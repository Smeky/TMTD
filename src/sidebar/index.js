import "./style.scss"
import React from "react"

import EditorSiderbarBlock from "./editor"
import ScenesSiderbarBlock from "./scenes"

// import { ButtonGroup, Button, Menu, MenuItem, MenuDivider } from "@blueprintjs/core"
// import { Popover2 } from "@blueprintjs/popover2";

export class SiderbarBlock extends React.Component {
    render() {
        return (
            <div className="siderbar-block">
                {this.props.children}
            </div>
        )
    }
}

const SiderbarDivider = () => (
    <div className="siderbar-divider"></div>
)

export class Sidebar extends React.Component {
    render() {
        const list = [ScenesSiderbarBlock, EditorSiderbarBlock].reduce((acc, Block, index, blocks) => {
            acc.push(<Block key={`block-${index}`} />)

            if (acc.length > 0 && index < blocks.length - 1) {
                acc.push(<SiderbarDivider key={`divider-${index}`} />)
            }

            return acc
        }, [])

        return (
            <div className="siderbar bp3-dark">
                {list}
            </div>
        )
    }
}
