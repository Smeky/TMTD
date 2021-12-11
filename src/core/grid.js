import { Vec2, Rect } from "game/graphics"
import { Tile, TilePalette } from "game/core"
import { Container, Sprite } from "pixi.js"

export default class Grid extends Container {
    constructor() {
        super()

        this.tiles = []
    }

    async loadFromFile(filename) {
        // Todo: copy pixi's way of dynamic imports.. or find better than this
        //       because here we have to specify folder path (webpack's dynamic import)
        const file = await import("media/levels/" + filename)
        this.loadFromJson(file)
    }

    loadFromJson(json) {
        const palette = new TilePalette(json.meta.paletteAssetId)
        
        this.size = new Vec2(json.meta.width, json.meta.height)

        for (const tileData of json.tiles) {
            palette.selectTile(tileData.index)

            const sprite = new Sprite(palette.getSelectedTileTexture())
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

    getTilesByBounds(bounds) {
        const expectedCount = Math.ceil(bounds.w / Tile.Size) * Math.ceil(bounds.h / Tile.Size)
        const filtered = this.tiles.filter((tile) => new Rect(tile.pos.x, tile.pos.y, Tile.Size, Tile.Size).intersects(bounds))

        if (filtered.length !== expectedCount) {
            return null
        }

        return filtered
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

    setTilesBlocked(tiles, state) {
        for (const tile of tiles) {
            tile.isBlocked = state
        }
    }

    getTopLeftTile(tiles) {
        // Todo: fix this when we fix grid indices
        return tiles.reduce((candidate, tile) => {
            if (!candidate) {
                candidate = tile
            }
            else {
                if (tile.x < candidate.x || tile.y < candidate.y) {
                    candidate = tile
                }
            }

            return candidate
        }, null)
    }
}