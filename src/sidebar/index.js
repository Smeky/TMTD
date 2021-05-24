import "./style.scss"
import React, { useState, useEffect } from "react"

import EditorSiderbarBlock from "./editor"
import ScenesSiderbarBlock from "./scenes"

export function SiderbarBlock(props) {
    return (
        <div className="siderbar-block">
            {props.children}
        </div>
    )
}

export function SiderbarDivider() {
    return <div className="siderbar-divider"></div>
}

export function Sidebar(props) {
    const [blocks, setBlocks] = useState([])

    const onSceneChanged = (sceneId) => {
        setBlocks([
            ScenesSiderbarBlock,
            ...(sceneId === "editor" ? [EditorSiderbarBlock] : [])
        ])
    }

    props.game.on("scene_changed", onSceneChanged)

    useEffect(() => {
        return () => props.game.removeListener("scene_changed", onSceneChanged)
    })

    const list = blocks.reduce((acc, Block, index) => {
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
