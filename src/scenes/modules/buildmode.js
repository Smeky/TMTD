import { createTowerDisplay } from "game/utils"
import { Tile } from "game/core"
import { Rect, Vec2 } from "game/graphics"
import { Graphics, Sprite } from "pixi.js"
import { IModule } from "."
import { TowerData } from "game/data"
import LevelLayers from "game/scenes/level/layers"
import { Game } from "game/"

export default class BuildMode extends IModule {
    setup() {
        this.enabled = false
        this.selectedTower = null

        this.inputProxy = Game.input.getProxy()

        this.mask = new Sprite.from("media/build_mask.png") // Todo:texture: load from assets
        this.mask.scale.set(2, 2)

        // We're gonna need to play around a bit to find something that looks good :)
        this.buildTiles = new Graphics()
        this.buildTiles.alpha = 0.6
        this.buildTiles.mask = this.mask
        this.buildTiles.visible = false

        Game.world.addChild(this.buildTiles, LevelLayers.BuildmodeTiles)
        Game.world.addChild(this.mask, LevelLayers.BuildmodeTiles)

        Game.on("tower_built", this.updateBuildTiles)
        Game.on("tower_selected", this.onTowerSelected)
        Game.on("tower_unselected", this.onTowerUnselected)

        this.inputProxy.on("pointerup", this.handleMouseUp)
        this.inputProxy.on("pointermove", this.handleMouseMove)
    }

    close() {
        Game.world.removeChild(this.buildTiles)
        Game.world.removeChild(this.mask)

        if (this.highlight) {
            Game.world.removeChild(this.highlight)
        }

        this.inputProxy.close()

        Game.removeListener("tower_built", this.updateBuildTiles)
        Game.removeListener("tower_selected", this.onTowerSelected)
        Game.removeListener("tower_unselected", this.onTowerUnselected)
    }

    update(delta) {

    }

    setSelectedTower(towerId) {
        this.selectedTower = towerId

        // Setup highlight
        if (this.highlight) {
            this.highlight.parent.removeChild(this.highlight)
        }

        const data = TowerData[this.selectedTower]
        const { width, height } = Game.assets[data.base.textureId]

        this.highlight = createTowerDisplay(data)
        this.highlight.alpha = 0.8
        this.highlight.pivot.x = width / 2
        this.highlight.pivot.y = height / 2

        Game.world.addChild(this.highlight, LevelLayers.BuildmodeHighlight)
    }

    toggle() {
        this.enabled = !this.enabled
        
        this.buildTiles.visible = this.enabled
        this.highlight.visible = this.enabled

        if (this.enabled) {
            this.updateBuildTiles()

            // Mouse pos
            const screenPos = Game.interaction.mouse.global
            const worldPos = Game.world.correctMousePos(screenPos)

            this.mask.x = worldPos.x - (this.mask.width) / 2
            this.mask.y = worldPos.y - (this.mask.height) / 2

            this.highlight.x = worldPos.x
            this.highlight.y = worldPos.y
        }
        else {
            this.selectedTower = null
            this.buildTiles.clear()
        }
    }

    updateBuildTiles = () => {
        this.buildTiles.clear()

        const padding = 4
        const tiles = Game.world.grid.getAllGroundTiles()

        for (const tile of tiles) {
            if (!tile.isBlocked) {
                this.buildTiles.beginFill(0xdcecf9)
            }
            else {
                this.buildTiles.beginFill(0xff0000)
            }

            const bounds = new Rect(
                tile.pos.x + padding,
                tile.pos.y + padding,
                Tile.Size  - padding * 2,
                Tile.Size  - padding * 2,
            )

            this.buildTiles.drawRect(bounds.x, bounds.y, bounds.w, bounds.h)
        }

        this.buildTiles.endFill()
    }

    updateHighlightPosition(position) {
        this.mask.x = position.x - (this.mask.width) / 2
        this.mask.y = position.y - (this.mask.height) / 2

        const snapped = Game.world.grid.snapPosToTile(position.add(Tile.Size / 2))
        this.highlight.x = snapped.x
        this.highlight.y = snapped.y
    }

    handleMouseUp = (event) => {
        if (this.enabled) {
            const { x, y, pivot } = this.highlight
            
            Game.emit("build_tower", { 
                towerId: this.selectedTower,
                pos: new Vec2(x - pivot.x, y - pivot.y), 
            })
        }
    }

    handleMouseMove = (event) => {
        if (this.enabled) {
            const { x, y } = event
            const pos = Game.world.correctMousePos(new Vec2(x, y))
    
            this.updateHighlightPosition(pos)
        }
    }

    onTowerSelected = towerId => {
        this.setSelectedTower(towerId)
        this.updateHighlightPosition(Game.world.getMousePos())

        if (!this.enabled) {
            this.toggle()
        }
    }
    
    onTowerUnselected = () => {
        if (this.enabled) {
            this.toggle()
        }
    }
}
