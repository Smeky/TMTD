import Scene from "game/scenes/scene"
import {TilePalette} from "game/core/palette"
import {Tile} from "game/core/tile"
import {Vec2} from "game/core/structs"
import * as pixi from "pixi.js"
import utils from "game/utils"
import { Rect } from "../core/structs"

export default class EditorScene extends Scene {
    constructor() {
        super("editor")

        this.inputProxy = game.input.getProxy()
        this.inputProxy.on("mousemove", this.handleMouseMove)

        this.sceneContainer.interactive = true
        this.sceneContainer.on("mousedown", this.togglePainting)
        this.sceneContainer.on("mouseup", this.togglePainting)

        this.isPainting = false

        this.defaultPreviewAlpha = 0.5
        this.preview = new pixi.Sprite()
        this.preview.alpha = this.defaultPreviewAlpha

        this.palette = new TilePalette("media/tileset.png", {visible: true})
        this.palette.x = Math.round(-Math.min(window.innerWidth / 2, 700) + 50)
        this.palette.y = Math.round(-window.innerHeight / 2 + 100)
        this.palette.onSelected = (index) => {
            this.preview.texture = this.palette.getTileTexture(index)
        }

        this.tiles = []
        this.tilesContainer = new pixi.Container()
        
        const tilesToClipboard = new pixi.Container()
        tilesToClipboard.position.x = 0
        tilesToClipboard.position.y = -window.innerHeight / 2 + 70
        tilesToClipboard.interactive = true
        tilesToClipboard.on("mouseup", () => {
            utils.strToClipboard(JSON.stringify(this.exportGrid(), null, 2))
        })
        tilesToClipboard.addChild(new pixi.Text("Copy to clipboard", {fill: "#ffffff"}))
        tilesToClipboard.pivot.x = tilesToClipboard.getLocalBounds().width / 2
        
        this.sceneContainer.addChild(this.tilesContainer)
        this.sceneContainer.addChild(this.preview)
        this.sceneContainer.addChild(this.palette)
        this.sceneContainer.addChild(tilesToClipboard)
    }

    close() {
        this.inputProxy.close()
    }

    handleTilePlacement(clampedPos) {
        let tile = this.tiles.find(tile => tile.x === clampedPos.x && tile.y === clampedPos.y)

        if (!tile) {
            tile = new pixi.Sprite(this.palette.getSelectedTileTexture())
            tile.x = clampedPos.x
            tile.y = clampedPos.y
            tile.textureIndex = this.palette.getSelectedTileTextureIndex()

            this.tiles.push(tile)
            this.tilesContainer.addChild(tile)
        }
        else {
            const texture = this.palette.getSelectedTileTexture()
            let textureIndex = this.palette.getSelectedTileTextureIndex()

            // resolve tile type, layer, etc..
            if (!new Rect(texture.orig).compare(tile.texture.orig)) {
                tile.texture = texture
                tile.textureIndex = textureIndex
            }
        }
    }

    togglePainting = () => {
        this.isPainting = !this.isPainting
        // Need to use alpha because visible would reduce the size of container
        // and we would not be able to catch mouse events -.-'
        this.preview.alpha = this.isPainting ? 0 : this.defaultPreviewAlpha
    }

    handleMouseMove = (event) => {
        const {layerX, layerY} = event

        // Todo:util: PLEASE make some func that would give pos based on stage's pivot and size
        let pos = new Vec2(
            layerX - window.innerWidth / 2 - Tile.Size / 2,
            layerY - window.innerHeight / 2 - Tile.Size / 2,
        )
        
        pos = utils.clampPosToGrid(pos, Tile.Size)
        this.preview.x = pos.x
        this.preview.y = pos.y

        if (this.isPainting && this.palette.hasTileSelected()) {
            this.handleTilePlacement(pos)
        }
    }

    exportGrid() {
        if (this.tiles.length === 0) {
            return null
        }

        // Calc offset so we can set topleft position of the grid to 0,0
        // and reposition all tiles accordingly
        const offset = this.tiles
            .reduce((smallest, tile) => {
                if (tile.x < smallest.x) smallest.x = tile.x
                if (tile.y < smallest.y) smallest.y = tile.y

                return smallest
            }, new Vec2())
            .apply(Math.abs)

        const tiles = this.tiles
            .map(tile => ({
                // Fix position as explained above & positions should be
                // relative (0, 1, 2)
                x: (tile.x + offset.x) / Tile.Size,
                y: (tile.y + offset.y) / Tile.Size,
                index: tile.textureIndex
            }))
            // Sort tiles top down, left to right 
            .sort((a, b) => a.y < b.y || (a.y === b.y && a.x < b.x) ? -1 : 1)

        // Calc width and height of the grid 
        const size = tiles
            .reduce((highest, tile) => {
                if (tile.x > highest.x) highest.x = tile.x
                if (tile.y > highest.y) highest.y = tile.y

                return highest
            }, new Vec2())
            .add(new Vec2(1, 1))

        return {
            meta: {
                width: size.x,
                height: size.y,
                paletteFile: this.palette.filename
            },
            tiles
        }
    }
}