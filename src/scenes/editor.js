import Scene from "game/scenes/scene"
import utils from "game/utils"
import {Vec2, Rect} from "game/core/structs"
import * as pixi from "pixi.js"

// Todo:ui: Make this into some kind of UI element
class Pallete extends pixi.Container {
    constructor(colors) {
        super()

        this.colors = []
        this.onColorSet = null

        const offset = 5
        const size = 50
        const sizeAndOffset = size + offset
        const perCol = 5

        colors.forEach((color, index) => {
            const sprite = game.graphics.createRectSprite(new Rect(0, 0, size, size), utils.rbgColorToHex(color))
                
            sprite.interactive = true
            sprite.on("mouseup", (event) => {
                event.stopPropagation()
                this.selectColor(color)
            })

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
        
        const newColor = this.colors.find(newColor => newColor.value === color)
        this.selection.color = newColor
        this.selection.border.x = newColor.sprite.x
        this.selection.border.y = newColor.sprite.y

        if (this.onColorSet) {
            this.onColorSet()
        }
    }
}

export default class EditorScene extends Scene {
    constructor() {
        super("editor")

        this.eventProxy = game.events.getProxy()
        this.eventProxy.listen("mousemove", this.handleMouseMove)
        this.eventProxy.listen("mousedown", this.handleMouseDown)
        this.eventProxy.listen("mouseup",   this.handleMouseUp)

        this.pallete = new Pallete(["#ff0000", "#00ff00", "#0000ff", "#00ffff", "#ff00ff"])
        this.pallete.x = Math.round(-Math.min(window.innerWidth / 2, 700) + 100)
        this.pallete.y = Math.round(-window.innerHeight / 2 + 50)
        this.pallete.onColorSet = this.updateMouseTile

        this.mouseTile = new pixi.Sprite(this.pallete.selection.color.sprite.texture)
        this.mouseTile.width = 32
        this.mouseTile.height = 32

        this.tempGrid = new pixi.Container()
        this.isPainting = false

        this.sceneContainer.addChild(this.tempGrid)
        this.sceneContainer.addChild(this.mouseTile)
        this.sceneContainer.addChild(this.pallete)
    }

    close() {
        this.eventProxy.close()
    }

    clampPosToGrid(pos) {
        return new Vec2(
            Math.floor((pos.x + 16) / 32) * 32,
            Math.floor((pos.y + 16) / 32) * 32,
        )
    }
    
    handleTilePlacement(pos) {
        if (!this.tempGrid.children.find(tile => tile.x === pos.x && tile.y === pos.y)) {
            const tile = new pixi.Sprite(this.pallete.selection.color.sprite.texture)
            tile.x = pos.x
            tile.y = pos.y
            tile.width = 32
            tile.height = 32

            this.tempGrid.addChild(tile)
        }
    }

    handleMouseMove = (event) => {
        const {layerX, layerY} = event
        
        let pos = new Vec2(
            layerX - window.innerWidth / 2 - 16,
            layerY - window.innerHeight / 2 - 16
        )

        pos = this.clampPosToGrid(pos)

        this.mouseTile.alpha = 0.3
        this.mouseTile.x = pos.x
        this.mouseTile.y = pos.y

        if (this.isPainting) {
            this.handleTilePlacement(pos)
        }
    }

    handleMouseDown = (event) => {
        const {layerX, layerY} = event
        
        let pos = new Vec2(
            layerX - window.innerWidth / 2 - 16,
            layerY - window.innerHeight / 2 - 16
        )

        pos = this.clampPosToGrid(pos)

        this.handleTilePlacement(pos)
        this.isPainting = true
    }

    handleMouseUp = () => {
        this.isPainting = false
    }

    updateMouseTile = () => {
        this.mouseTile.texture = this.pallete.selection.color.sprite.texture
    }
}