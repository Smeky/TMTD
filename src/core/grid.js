import { Vec2, Rect } from "game/graphics"
import { Tile } from "game/core/tile"
import { TilePalette } from "game/core/palette"
import * as pixi from "pixi.js"

export class Grid extends pixi.Container {
    constructor() {
        super()

        this.tiles = []
    }

    async loadFromFile(filename) {
        // Todo: copy pixi's way of dynamic imports.. or find better than this
        //       because here we have to specify folder path (webpack's dynamic import)
        const file = await import("media/levels/" + filename)
        const palette = new TilePalette(file.meta.paletteFile)
        
        this.size = new Vec2(file.meta.width, file.meta.height)
        // this.pivot.x = this.size.x * Tile.Size / 2
        // this.pivot.y = this.size.y * Tile.Size / 2

        for (const tileData of file.tiles) {
            palette.selectTile(tileData.index)

            const sprite = new pixi.Sprite(palette.getSelectedTileTexture())
            const pos = new Vec2(tileData.x, tileData.y).multiply(new Vec2(Tile.Size, Tile.Size))

            const tile = new Tile(pos, sprite)
            tile.isPath = tileData.isPath

            this.tiles.push(tile)
            this.addChild(sprite)
        }
    }

    getPathTiles() {
        return this.tiles.filter(tile => tile.isPath)
    }

    getAllGroundTiles() {
        return this.tiles.filter(tile => !tile.isPath)
    }

    getTileByPos(pos) {
        return this.tiles.find((tile) => new Rect(tile.pos.x, tile.pos.y, Tile.Size, Tile.Size).isPointInside(pos))
    }

    getTilesByBounds(bounds){ 
        return this.tiles.filter((tile) => new Rect(tile.pos.x, tile.pos.y, Tile.Size, Tile.Size).intersects(bounds))
    }

    isTileObstructed(tile) {
        return tile.isBlocked || tile.isPath
    }

    snapPosToTile(pos) {
        return new Vec2(
            pos.x -= pos.x % Tile.Size,
            pos.y -= pos.y % Tile.Size,
        )
    }

    sizeInPixels() {
        return this.size.multiply(new Vec2(Tile.Size, Tile.Size))   
    }
}