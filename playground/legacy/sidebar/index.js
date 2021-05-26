import "./style.scss"
import React, { useState, useEffect } from "react"

import EditorSidebarBlock from "./editor"
import ScenesSidebarBlock from "./scenes"

export function SidebarBlock(props) {
    return (
        <div className="sidebar-block">
            {props.children}
        </div>
    )
}

export function SidebarDivider() {
    return <div className="sidebar-divider"></div>
}

function SidebarContainer(props) {
    const [visible, setVisible] = useState(false)
    
    const onSetVisibility = state => setVisible(state)
    props.game.on("set_sidebar_visibility", onSetVisibility)

    useEffect(() => {
        return () => props.game.removeListener("set_sidebar_visibility", onSetVisibility)
    })
    
    return (
        <div className={"sidebar-container" + (visible ? "" : " sidebar-hidden")}>
            {props.children}
        </div>
    )
}

function useSidebarBlocks() {
    const [blocks, setBlocks] = useState([])

    useEffect(() => {
        const handleCommand = command => {
            if (command.type === "add_blocks") {
                setBlocks([ ...blocks, ...command.data.blocks ])
            }
        }
        
        game.on("sidebar_command", handleCommand)

        return () => { game.removeListener("sidebar_command", handleCommand) }
    })

    return blocks
}

export function Sidebar(props) {
    const blocks = useSidebarBlocks()

    const list = blocks.reduce((acc, Block, index) => {
        acc.push(<Block key={`block-${index}`} />)

        if (acc.length > 0 && index < blocks.length - 1) {
            acc.push(<SidebarDivider key={`divider-${index}`} />)
        }

        return acc
    }, [])

    return (
        <SidebarContainer {...props}>
            <div className="sidebar bp3-dark">
                {list}
            </div>
        </SidebarContainer>
    )
}
