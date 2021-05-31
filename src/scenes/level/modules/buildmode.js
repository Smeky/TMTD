import { createTowerDisplay } from "game/utils"
import { Tile } from "game/core"
import { Rect, Vec2 } from "game/graphics"
import { Graphics, Sprite } from "pixi.js"
import IModule from "game/scenes/imodule"

export default class BuildMode extends IModule {
    static Name = "buildMode"

    setup() {
        this.enabled = false
        this.selectedTower = null

        this.inputProxy = game.input.getProxy()

        this.mask = new Sprite.from("media/build_mask.png") // Todo:texture: load from assets
        this.mask.scale.set(2, 2)

        // We're gonna need to play around a bit to find something that looks good :)
        this.buildTiles = new Graphics()
        this.buildTiles.alpha = 0.6
        this.buildTiles.mask = this.mask
        this.buildTiles.visible = false

        this.scene.addChild(this.buildTiles, this.scene.BuildmodeTiles)
        this.scene.addChild(this.mask, this.scene.BuildmodeTiles)

        game.on("tower_built", this.updateBuildTiles)
        game.on("tower_selected", this.onTowerSelected)
        game.on("tower_unselected", this.onTowerUnselected)

        this.inputProxy.on("pointerup", this.handleMouseUp)
        this.inputProxy.on("pointermove", this.handleMouseMove)
    }

    close() {
        this.scene.removeChild(this.buildTiles)
        this.scene.removeChild(this.mask)

        if (this.highlight) {
            this.scene.removeChild(this.highlight)
        }

        this.inputProxy.close()

        game.removeListener("tower_built", this.updateBuildTiles)
        game.removeListener("tower_selected", this.onTowerSelected)
        game.removeListener("tower_unselected", this.onTowerUnselected)
    }

    update(delta) {

    }

    setSelectedTower(tower) {
        this.selectedTower = tower

        // Setup highlight
        if (this.highlight) {
            this.highlight.parent.removeChild(this.highlight)
        }

        this.highlight = createTowerDisplay(this.selectedTower)
        this.highlight.alpha = 0.8
        this.highlight.pivot.copyFrom(this.selectedTower.size.divide(2))

        this.scene.addChild(this.highlight, this.scene.Layers.BuildmodeHighlight)
    }

    toggle() {
        this.enabled = !this.enabled
        
        this.buildTiles.visible = this.enabled
        this.highlight.visible = this.enabled

        if (this.enabled) {
            this.updateBuildTiles()

            // Mouse pos
            const screenPos = game.renderer.plugins.interaction.mouse.global
            const worldPos = game.camera.correctMousePos(screenPos)

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
        const tiles = this.scene.grid.getAllGroundTiles()

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

        const snapped = this.scene.grid.snapPosToTile(position.add(Tile.Size / 2))
        this.highlight.x = snapped.x
        this.highlight.y = snapped.y
    }

    handleMouseUp = (event) => {
        if (this.enabled) {
            const { x, y, pivot } = this.highlight
            
            game.emit("build_tower", { 
                tower: this.selectedTower,
                pos: new Vec2(x - pivot.x, y - pivot.y), 
            })
        }
    }

    handleMouseMove = (event) => {
        if (this.enabled) {
            const { x, y } = event
            const pos = game.camera.correctMousePos(new Vec2(x, y))
    
            this.updateHighlightPosition(pos)
        }
    }

    onTowerSelected = tower => {
        this.setSelectedTower(tower)
        this.updateHighlightPosition(game.camera.getMousePos())

        if (!this.enabled) {
            this.toggle()
        }
    }
    
    onTowerUnselected = () => {
        this.toggle()
    }
}
