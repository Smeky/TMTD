import utils from "game/utils"
import { Rect, Vec2 } from "game/graphics"
import { BLEND_MODES, Container, Graphics, Sprite } from "pixi.js"
import { AdvancedBloomFilter, KawaseBlurFilter, ShockwaveFilter } from "pixi-filters"
// import { Tile } from "./tile"

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
            ...options
        }

        this.enabled = false
        
        const speed = 250
        this.openAnim = {
            running: false,
            mask: new Graphics(),
            filter: new ShockwaveFilter([game.width / 2, game.height / 2], {
                speed,
                amplitude: 3,
                wavelength: 100,
            }),
            edge: new Graphics(),
            speed,
        }

        const texture = utils.createRectTexture(new Rect(0, 0, game.width, game.height), 0x102050)
        this.overlaySprite = new Sprite(texture)
        this.overlaySprite.visible = this.enabled
        this.overlaySprite.blendMode = BLEND_MODES.MULTIPLY
        this.overlaySprite.alpha = 0.8
        this.overlaySprite.mask = this.openAnim.mask
        this.overlaySprite.filters = [ new KawaseBlurFilter()]

        this.openAnim.mask.x = texture.width / 2
        this.openAnim.mask.y = texture.height / 2
        this.openAnim.edge.x = texture.width / 2
        this.openAnim.edge.y = texture.height / 2

        {
            const filter = new AdvancedBloomFilter()
            filter.padding = 50
            filter.threshold = 0
            filter.blur = 4
            filter.bloomScale = 4

            this.openAnim.edge.filters = [filter]
        }

        // this.buildTiles = new Graphics()
        // this.buildTiles.alpha = 0.4

        this.addChild(this.overlaySprite)
        this.addChild(this.openAnim.mask)
        this.addChild(this.openAnim.edge)
        // this.options.cameraLayers.addChild(this.buildTiles, 50)
    }

    update(delta) {
        if (this.openAnim.running) {
            const { width } = this.openAnim.mask.getLocalBounds()
            const normalized = width / this.overlaySprite.width
            const newDelta = (1 + normalized * 15) * delta
            const radius = width / 2 + this.openAnim.speed * newDelta

            this.openAnim.mask.clear()
            this.openAnim.mask.beginFill(0xffffff)
            this.openAnim.mask.drawCircle(0, 0, radius)
            this.openAnim.mask.endFill()

            this.openAnim.edge.clear()
            this.openAnim.edge.lineStyle(1, 0xa6c5ef)
            this.openAnim.edge.drawCircle(0, 0, radius)
            this.openAnim.edge.endFill()

            this.openAnim.filter.time += newDelta

            if (radius > new Vec2(game.width / 2, game.height / 2).length()) {
                this.openAnim.running = false
                this.openAnim.edge.visible = false
            }
        }
    }

    toggle() {
        this.enabled = !this.enabled
        this.overlaySprite.visible = this.enabled
        this.openAnim.edge.visible = this.enabled

        if (this.enabled) {
            this.openAnim.running = true
            // todo: eww, fix me
            game.sceneHandler.scene.camera.parent.filters = [this.openAnim.filter] 

            // this.buildTiles.clear()
            // this.buildTiles.beginFill(0xffffff)

            // const padding = 4
            // const tiles = this.options.grid.getAllGroundTiles()
            //                                .filter(tile => !tile.isBlocked)

            // for (const tile of tiles) {
            //     const bounds = new Rect(
            //         tile.pos.x + padding,
            //         tile.pos.y + padding,
            //         Tile.Size  - padding * 2,
            //         Tile.Size  - padding * 2,
            //     )

            //     this.buildTiles.drawRect(bounds.x, bounds.y, bounds.w, bounds.h)
            // }

            // this.buildTiles.endFill()
        }
        else {
            this.openAnim.running = false
            this.openAnim.mask.clear()
            this.openAnim.mask.scale.x = 1
            this.openAnim.mask.scale.y = 1
            this.openAnim.filter.time = 0
            // todo: eww, fix me
            game.sceneHandler.scene.camera.parent.filters = [] 

            // this.buildTiles.clear()
        }
    }
}
