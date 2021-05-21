import "./style.scss"
import React from "react"

import { ButtonGroup, Button, Menu, MenuItem, MenuDivider } from "@blueprintjs/core"
import { Popover2 } from "@blueprintjs/popover2";

const LevelMenu = props => {
    return (
        <Menu>
            <MenuItem icon="new-text-box" text="New level" onClick={() => game.emit("sidebar.new_level", 0)} />
            <MenuDivider />
            <MenuItem icon="document-open" text="Open File..." onClick={() => game.emit("sidebar.open_file")} />
            <MenuDivider />
            <MenuItem icon="floppy-disk" text="Save" onClick={() => game.emit("sidebar.save_level")} />
            <MenuItem icon="floppy-disk" text="Save As..." onClick={() => game.emit("sidebar.save_level_as")} />

            {/* <MenuItem text="Settings..." icon="cog">
                <MenuItem icon="tick" text="Save on edit" />
                <MenuItem icon="blank" text="Compile on edit" />
            </MenuItem> */}
        </Menu>
    )
}

export class Sidebar extends React.Component {
    render() {
        return (
            <div className="siderbar bp3-dark">
                <ButtonGroup fill>
                    <Popover2 content={<LevelMenu />} placement="bottom-start">
                        <Button rightIcon="caret-down" icon="document" text="Level"></Button>
                    </Popover2>
                </ButtonGroup>
            </div>
        )
    }
}

