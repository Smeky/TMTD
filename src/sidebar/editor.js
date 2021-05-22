import { SiderbarBlock } from "."
import React from "react"

import { ButtonGroup, Button, Classes, Menu, MenuItem, MenuDivider, Label } from "@blueprintjs/core"
import { Popover2 } from "@blueprintjs/popover2";

const LevelMenu = () => {
    return (
        <Menu>
            <MenuItem icon="new-text-box" text="New level" onClick={() => game.emit("sidebar.new_level", 0)} />
            <MenuDivider />
            <MenuItem icon="document-open" text="Open File..." onClick={() => game.emit("sidebar.open_file")} />
            <MenuDivider />
            <MenuItem icon="floppy-disk" text="Save" onClick={() => game.emit("sidebar.save_level")} />
            <MenuItem icon="floppy-disk" text="Save As..." onClick={() => game.emit("sidebar.save_level_as")} />

            {/* 
                <MenuItem text="Settings..." icon="cog">
                    <MenuItem icon="tick" text="Save on edit" />
                    <MenuItem icon="blank" text="Compile on edit" />
                </MenuItem> 
            */}
        </Menu>
    )
}

export default class EditorSiderbarBlock extends React.Component {
    onTitleChange = (event) => {
        const { target } = event
        game.scene.handlers.editorLevelManager.levelData.title = target.value

        this.forceUpdate()  // Todo: remove this when we add a data store
    }

    render() {
        const { title } = game.scene.handlers.editorLevelManager.levelData

        return (
            <SiderbarBlock>
                <ButtonGroup fill>
                    <Popover2 content={<LevelMenu />} placement="bottom-start">
                        <Button rightIcon="caret-down" icon="document" text="Level"></Button>
                    </Popover2>
                </ButtonGroup>
                
                <Label className="bp3-inline">
                    Title: 
                    <input className={Classes.INPUT} placeholder="Enter level title.." onChange={this.onTitleChange} value={title} />
                </Label>
            </SiderbarBlock>
        )
    }
}
