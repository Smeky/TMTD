import { Game } from "game/"
import { IModule } from "."

export default class UserInputModule extends IModule {
    setup() {
        this.inputProxy = Game.input.getProxy()
        this.inputProxy.on("keyup", this.onKeyUp)
    }
    
    close() {
        this.inputProxy.close()
    }

    onKeyUp = (event) => {
        if (event.key === "1") {
            Game.emit("select_tower", 0)
        }
        else if (event.key === "2") {
            Game.emit("select_tower", 1)
        }
        else if (event.key === "Escape") {
            Game.emit("unselect_tower")
        }
    }
}