import { SiderbarBlock } from "."
import React from "react"

import { Button, ButtonGroup } from "@blueprintjs/core";

const createSceneButton = (sceneId, label) => {
    return (
        <Button text={label} onClick={() => game.emit("change_scene", sceneId)}></Button>
    )
}

export default class ScenesSiderbarBlock extends React.Component {
    render() {
        return (
            <SiderbarBlock>
                <ButtonGroup>
                    {createSceneButton("level", "Level")}
                    {createSceneButton("editor", "Editor")}
                </ButtonGroup>
            </SiderbarBlock>
        )
    }
}
