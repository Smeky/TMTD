import utils from "game/utils"
import { Tile } from "game/core/tile"
import { Rect, Vec2 } from "game/graphics"
import { Container, Graphics, Sprite } from "pixi.js"

export class BuildMode extends Container {
    /**
     * 
     * @param {object}  options 
     * @param {Grid}    options.grid
     * @param {Layers}  options.cameraLayers
     */
    constructor(options) {
        super()

        this.options = {
            grid: null,
            camera: null,
            cameraLayers: null, // Todo:architecture: We need to solve this passing down.. it's weird
            ...options
        }

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

        this.options.cameraLayers.addChild(this.buildTiles, 50)
        this.options.cameraLayers.addChild(this.mask, 50)

        game.on("towerBuilt", this.updateBuildTiles)
    }

    close() {
        this.inputProxy.close()
        game.removeListener("towerBuilt", this.updateBuildTiles)
    }

    update(delta) {

    }

    setSelectedTower(tower) {
        this.selectedTower = tower

        // Setup highlight
        if (this.highlight) {
            this.highlight.parent.removeChild(this.highlight)
        }

        this.highlight = utils.createTowerDisplay(this.selectedTower)
        this.highlight.alpha = 0.8
        this.highlight.pivot.x = this.highlight.width / 2
        this.highlight.pivot.y = this.highlight.height / 2

        this.options.cameraLayers.addChild(this.highlight, 51)
    }

    toggle() {
        this.enabled = !this.enabled
        
        this.buildTiles.visible = this.enabled
        this.highlight.visible = this.enabled

        if (this.enabled) {
            this.updateBuildTiles()

            // Mouse pos
            const screenPos = game.renderer.plugins.interaction.mouse.global
            const worldPos = this.options.camera.correctMousePos(screenPos)

            this.mask.x = worldPos.x - (this.mask.width) / 2
            this.mask.y = worldPos.y - (this.mask.height) / 2

            this.highlight.x = worldPos.x
            this.highlight.y = worldPos.y

            this.inputProxy.on("mouseup", this.handleMouseUp)
            this.inputProxy.on("mousemove", this.handleMouseMove)
        }
        else {
            this.selectedTower = null
            this.buildTiles.clear()

            this.inputProxy.leave(this.handleMouseUp)
            this.inputProxy.leave(this.handleMouseMove)
        }
    }

    updateBuildTiles = () => {
        this.buildTiles.clear()

        const padding = 4
        const tiles = this.options.grid.getAllGroundTiles()

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

    handleMouseUp = (event) => {
        const { x, y, pivot } = this.highlight
        game.emit("buildTower", new Vec2(x - pivot.x, y - pivot.y))
    }

    handleMouseMove = (event) => {
        const { x, y } = event
        const pos = this.options.camera.correctMousePos(new Vec2(x, y))

        this.mask.x = pos.x - (this.mask.width) / 2
        this.mask.y = pos.y - (this.mask.height) / 2

        const snapped = this.options.grid.snapPosToTile(pos.add(Tile.Size / 2))
        this.highlight.x = snapped.x
        this.highlight.y = snapped.y
    }
}
