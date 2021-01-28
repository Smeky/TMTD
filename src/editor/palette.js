import * as pixi from "pixi.js"
import {Tile} from "game/core/tile"

export class TilePalette extends pixi.Container {
    constructor(filename) {
        super()

        this.onSelected = null
        this.atlas = new pixi.Texture.from(filename)
        this.tiles = new pixi.Container()

        // Todo: replace nums with atlas.w/h when we have texture loading at start
        const w = Math.ceil(96 / Tile.Size)
        const h = Math.ceil(128 / Tile.Size)
        const offset = 1

        // Setup palette tiles
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const clip = new pixi.Rectangle(x * Tile.Size, y * Tile.Size, Tile.Size, Tile.Size)
                const sprite = new pixi.Sprite(new pixi.Texture(this.atlas, clip))

                sprite.scale.set(2, 2)
                sprite.x = x * (Tile.Size * 2 + offset)
                sprite.y = y * (Tile.Size * 2 + offset)

                const index = x + y * w
                sprite.interactive = true
                sprite.on("mouseover", this.getMouseOverCallback(index))
                sprite.on("mouseup", this.getMouseUpCallback(index))

                this.tiles.addChild(sprite)
            }
        }

        this.selection = {
            graphics: new pixi.Graphics(),
            selected: -1,
            hover: -1,
        }

        this.addChild(this.tiles)
        this.addChild(this.selection.graphics)
        this.updateSelection()
    }

    updateSelection() {
        const {graphics} = this.selection

        graphics.clear()

        if (this.selection.selected >= 0) {
            const {x, y} = this.tiles.children[this.selection.selected]

            graphics.lineStyle(2, 0xffff50, 0.85)
            graphics.drawRect(x, y, Tile.Size * 2, Tile.Size * 2)
        }
        
        if (this.selection.hover >= 0) {
            const {x, y} = this.tiles.children[this.selection.hover]

            graphics.lineStyle(2, 0xffffff, 0.4)
            graphics.drawRect(x, y, Tile.Size * 2, Tile.Size * 2)
        }

        graphics.endFill()
    }

    getMouseOverCallback(index) {
        return () => {
            if (this.selection.hover !== index) {
                this.selection.hover = index
                this.updateSelection()
            }
        }
    }

    getMouseUpCallback(index) {
        return () => {
            if (this.selection.selected !== index) {
                this.selection.selected = index
                this.updateSelection()
                
                if (this.onSelected) {
                    this.onSelected(index)
                }
            }
        }
    }

    getTileTexture(index) {
        return this.tiles.children[index].texture
    }

    getSelectedTileTexture() {
        return this.getTileTexture(this.selection.selected)
    }

    hasTileSelected() {
        return this.selection.selected >= 0
    }
}