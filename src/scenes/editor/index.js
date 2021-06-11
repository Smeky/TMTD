import { IScene } from "game/scenes"
import { EditorLevelManager } from "./modules/editor_level_manager"
// import utils from "game/utils"
// import { Tile, TilePalette } from "game/core"
// import { Vec2 } from "game/graphics"
// import { Rect } from "game/graphics"
// import { Button } from "game/ui"
// import { Container, Sprite, Text } from "pixi.js"

export default class EditorScene extends IScene {
    static Name = "editor"
    static Modules = [EditorLevelManager]

    constructor() {
        super("editor")
    }

    setupScene() {

    }

    closeScene() {

    }

    // handleTilePlacement(clampedPos) {
    //     let tile = this.tiles.find(tile => tile.x === clampedPos.x && tile.y === clampedPos.y)

    //     if (!tile) {
    //         tile = new Sprite(this.palette.getSelectedTileTexture())
    //         tile.x = clampedPos.x
    //         tile.y = clampedPos.y
    //         tile.textureIndex = this.palette.getSelectedTileTextureIndex()

    //         this.tiles.push(tile)
    //         this.tilesContainer.addChild(tile)
    //     }
    //     else {
    //         const texture = this.palette.getSelectedTileTexture()
    //         let textureIndex = this.palette.getSelectedTileTextureIndex()

    //         // resolve tile type, layer, etc..
    //         if (!new Rect(texture.orig).compare(tile.texture.orig)) {
    //             tile.texture = texture
    //             tile.textureIndex = textureIndex
    //         }
    //     }
    // }

    // togglePainting = () => {
    //     this.isPainting = !this.isPainting
    //     // Need to use alpha because visible would reduce the size of container
    //     // and we would not be able to catch mouse events -.-'
    //     this.preview.alpha = this.isPainting ? 0 : this.defaultPreviewAlpha
    // }

    // handleMouseMove = (event) => {
    //     const {layerX, layerY} = event

    //     // Todo:util: PLEASE make some func that would give pos based on stage's pivot and size
    //     let pos = new Vec2(
    //         layerX - window.innerWidth / 2 - Tile.Size / 2,
    //         layerY - window.innerHeight / 2 - Tile.Size / 2,
    //     )
        
    //     pos = utils.clampPosToGrid(pos, Tile.Size)
    //     this.preview.x = pos.x
    //     this.preview.y = pos.y

    //     if (this.isPainting && this.palette.hasTileSelected()) {
    //         this.handleTilePlacement(pos)
    //     }
    // }

    // exportGrid() {
    //     if (this.tiles.length === 0) {
    //         return null
    //     }

    //     // Calc offset so we can set topleft position of the grid to 0,0
    //     // and reposition all tiles accordingly
    //     const offset = this.tiles
    //         .reduce((smallest, tile) => {
    //             if (tile.x < smallest.x) smallest.x = tile.x
    //             if (tile.y < smallest.y) smallest.y = tile.y

    //             return smallest
    //         }, new Vec2())
    //         .apply(c => -c) // negate x & y (so we move the grid to 0, 0 by pos + offset)

    //     const tiles = this.tiles
    //         // Todo: Temporary
    //         .filter(tile => [4, 10].includes(tile.textureIndex))
    //         .map(tile => ({
    //             // Fix position as explained above & positions should be
    //             // relative (0, 1, 2)
    //             x: (tile.x + offset.x) / Tile.Size,
    //             y: (tile.y + offset.y) / Tile.Size,
    //             index: tile.textureIndex,
    //             isPath: tile.textureIndex === 10 // Todo: Temporary
    //         }))
    //         // Sort tiles top down, left to right 
    //         .sort((a, b) => a.y < b.y || (a.y === b.y && a.x < b.x) ? -1 : 1)

    //     // Calc width and height of the grid 
    //     const size = tiles
    //         .reduce((highest, tile) => {
    //             if (tile.x > highest.x) highest.x = tile.x
    //             if (tile.y > highest.y) highest.y = tile.y

    //             return highest
    //         }, new Vec2())
    //         .add(new Vec2(1, 1))

    //     return {
    //         meta: {
    //             width: size.x,
    //             height: size.y,
    //             paletteFile: this.palette.filename
    //         },
    //         tiles
    //     }
    // }
}