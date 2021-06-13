import { IModule } from "."
import { Vec2 } from "game/graphics"
import { findPath, Tile } from "game/core"
import { Game } from "game/"

import LevelData from "media/levels/dev"

export default class LevelSetupModule extends IModule {
    setup() {
        {   // Think we should handle all of this waaay better ;)
            const { grid } = Game.world
    
            grid.loadFromJson(LevelData)
    
            const pathTiles = grid.getPathTiles()
                                  .map(tile => new Vec2(tile.pos).divide(Tile.Size))
    
            const start = new Vec2(3, 2)
            const end = new Vec2(14, 11)
    
            this.scene.path = findPath({ cells: pathTiles, start, end })
                .map(cell => cell.multiply(Tile.Size))
                .slice(1)


            const gridSize = grid.sizeInPixels()
            const centered = Game.getCanvasSize().subtract(gridSize).divide(2)
    
            Game.world.resetZoom()
            Game.world.moveTo(centered.round())
        }
    }
    
    close() {

    }
}