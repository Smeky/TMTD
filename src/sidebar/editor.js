import { SidebarBlock } from "."
import React, { useState, useEffect } from "react"

import { ButtonGroup, Button, Classes, Menu, MenuItem, MenuDivider, Label } from "@blueprintjs/core"
import { Popover2 } from "@blueprintjs/popover2";

function LevelMenu() {
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

export default function EditorSidebarBlock() {
    const handler = game.scene.handlers.editorLevelManager
    const [title, setTitle] = useState("")

    useEffect(() => {
        handler.levelData.title = title
    })

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }

    return (
        <SidebarBlock>
            <ButtonGroup fill>
                <Popover2 content={<LevelMenu />} placement="bottom-start">
                    <Button rightIcon="caret-down" icon="document" text="Level"></Button>
                </Popover2>
            </ButtonGroup>
            
            <Label className="bp3-inline">
                Title: 
                <input className={Classes.INPUT} placeholder="Enter level title.." onChange={handleTitleChange} value={title} />
            </Label>
        </SidebarBlock>
    )
}

