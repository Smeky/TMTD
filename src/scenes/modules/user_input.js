import { IModule } from "."

export default class UserInputModule extends IModule {
    setup() {
        this.inputProxy = game.input.getProxy()
        this.inputProxy.on("keyup", this.onKeyUp)
    }
    
    close() {
        this.inputProxy.close()
    }

    onKeyUp = (event) => {
        if (event.key === "1") {
            game.emit("select_tower", 0)
        }
        else if (event.key === "2") {
            game.emit("select_tower", 1)
        }
        else if (event.key === "Escape") {
            game.emit("unselect_tower")
        }
    }
}