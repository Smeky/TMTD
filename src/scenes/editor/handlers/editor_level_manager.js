import IHandler from "game/scenes/ihandler"

export class EditorLevelManager extends IHandler {
    static Name = "editorLevelManager"

    setup() {
        game.on("sidebar.new_level", this.onNewLevel)
        game.on("sidebar.open_file", this.onOpenFile)
        game.on("sidebar.save_level", this.onSaveLevel)
        game.on("sidebar.save_level_as", this.onSaveLevelAs)
    }

    close() {
        game.removeListener("sidebar.new_level", this.onNewLevel)
        game.removeListener("sidebar.open_file", this.onOpenFile)
        game.removeListener("sidebar.save_level", this.onSaveLevel)
        game.removeListener("sidebar.save_level_as", this.onSaveLevelAs)
    }

    onNewLevel = () => {
        console.log("onNewLevel")
    }

    onOpenFile = () => {
        console.log("onOpenFile")
    }

    onSaveLevel = () => {
        console.log("onSaveLevel")
    }

    onSaveLevelAs = () => {
        console.log("onSaveLevelAs")
    }
}