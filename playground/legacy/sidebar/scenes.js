import { SidebarBlock } from "."
import React from "react"

import { Button, ButtonGroup } from "@blueprintjs/core";

const createSceneButton = (sceneId, label) => {
    return (
        <Button text={label} onClick={() => game.emit("change_scene", sceneId)}></Button>
    )
}

export default function ScenesSidebarBlock() {
    return (
        <SidebarBlock>
            <ButtonGroup>
                {createSceneButton("level", "Level")}
                {createSceneButton("editor", "Editor")}
            </ButtonGroup>
        </SidebarBlock>
    )
}
