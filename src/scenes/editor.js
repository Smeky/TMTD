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

        this.tiles = new pixi.Container()

        const tilesToClipboard = new pixi.Container()
        tilesToClipboard.position.x = 0
        tilesToClipboard.position.y = -window.innerHeight / 2 + 70
        tilesToClipboard.interactive = true
        tilesToClipboard.on("mouseup", () => utils.copyToClipboard(this.getTilesInJSON()))
        tilesToClipboard.addChild(new pixi.Text("Copy to clipboard", {fill: "#ffffff"}))
        tilesToClipboard.pivot.x = tilesToClipboard.getLocalBounds().width / 2

        this.sceneContainer.addChild(this.tiles)
        this.sceneContainer.addChild(this.preview)
        this.sceneContainer.addChild(this.palette)
        this.sceneContainer.addChild(tilesToClipboard)
    }

    close() {
        this.inputProxy.close()
    }

    handleTilePlacement(clampedPos) {
        let tile = this.tiles.children.find(tile => tile.x === clampedPos.x && tile.y === clampedPos.y)

        if (!tile) {
            tile = new pixi.Sprite(this.palette.getSelectedTileTexture())
            tile.x = clampedPos.x
            tile.y = clampedPos.y
            tile.textureIndex = this.palette.getSelectedTileTextureIndex()

            this.tiles.addChild(tile)
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

    getTilesInJSON() {
        try {
            let tempTiles = {
                filename: this.tiles.getChildAt(0).texture.baseTexture.cacheId,
                grid: []
            }
            for (let tileIndex = 0; tileIndex < this.tiles.children.length; tileIndex++) {
                let tile =  {
                    x: this.tiles.getChildAt(tileIndex).x,
                    y: this.tiles.getChildAt(tileIndex).y,
                    textureIndex: this.tiles.getChildAt(tileIndex).textureIndex
                }
                tempTiles.grid.push(tile)
            }
            
            return JSON.stringify(tempTiles)
        } catch (e) {
            if (e instanceof Error) {
                console.warn("Tiles are empty")
            } else {
                console.error(e)
            }
        }
    }
}