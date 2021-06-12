import { IModule } from "."
import { Vec2 } from "game/graphics"
import { findPath, Tile } from "game/core"

import LevelData from "media/levels/dev"

export default class LevelSetupModule extends IModule {
    setup() {
        {   // Think we should handle all of this waaay better ;)
            const { grid } = game.world
    
            grid.loadFromJson(LevelData)
    
            const pathTiles = grid.getPathTiles()
                                  .map(tile => new Vec2(tile.pos).divide(Tile.Size))
    
            const start = new Vec2(3, 2)
            const end = new Vec2(14, 11)
    
            this.scene.path = findPath({ cells: pathTiles, start, end })
                .map(cell => cell.multiply(Tile.Size))
                .slice(1)


            const gridSize = grid.sizeInPixels()
            const centered = game.getCanvasSize().subtract(gridSize).divide(2)
    
            game.world.resetZoom()
            game.world.moveTo(centered.round())
        }
    }
    
    close() {

    }
}