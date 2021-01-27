import Scene from "game/scenes/scene"
import utils from "game/utils"
import {Rect} from "game/core/structs"
import * as pixi from "pixi.js"

// Todo:ui: Make this into some kind of UI element
class Pallete extends pixi.Container {
    constructor(colors) {
        super()

        const offset = 5
        const size = 70
        const sizeAndOffset = size + offset
        const perCol = 5

        this.colors = []

        colors.forEach((color, index) => {
            const sprite = game.graphics.createRectSprite(new Rect(0, 0, size, size), utils.rbgColorToHex(color))
                
            sprite.interactive = true
            sprite.on("mouseup", () => this.selectColor(color))

            const total = index * sizeAndOffset
            sprite.x = Math.floor(total / (perCol * sizeAndOffset)) * sizeAndOffset
            sprite.y = total % (perCol * sizeAndOffset)

            this.addChild(sprite)
            this.colors.push({
                value: color,
                sprite
            })
        })

        const border = new pixi.Graphics()
        border.lineStyle(2, 0xffffff, 1)
        border.drawRoundedRect(0, 0, size, size, 0.1)
        border.endFill()

        this.addChild(border)

        this.selection = {
            color: this.colors[0],
            border
        }
    }

    selectColor(color) {
        this.selection.color = color
        
        const newColor = this.colors.find(newColor => newColor.value === color)
        this.selection.color = newColor.value
        this.selection.border.x = newColor.sprite.x
        this.selection.border.y = newColor.sprite.y
    }
}

export default class EditorScene extends Scene {
    constructor() {
        super("editor")

        this.eventProxy = game.events.getProxy()

        this.pallete = new Pallete(["#ff0000", "#00ff00", "#0000ff", "#00ffff", "#ff00ff"])
        this.pallete.x = -Math.min(window.innerWidth / 2, 700) + 100
        this.pallete.y = -window.innerHeight / 2 + 50
        this.sceneContainer.addChild(this.pallete)
    }

    close() {
        this.eventProxy.close()
    }
}