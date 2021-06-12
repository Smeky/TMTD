import utils from "game/utils"
import { Rect } from "game/graphics"
import { ButtonBase } from "game/ui"
import { Sprite } from "pixi.js"
import { AdvancedBloomFilter, BevelFilter } from "pixi-filters"

export default class OptionsButton extends ButtonBase {
    constructor(icon, texture) {
        super()

        this.bg = new Sprite(texture)
        this.bg.tint = 0x20212b

        this.icon = icon
        this.icon.position.x = texture.width / 2
        this.icon.position.y = texture.height / 2

        this.addChild(this.bg)
        this.addChild(this.icon)

        this.setupFilters()
    }

    setupFilters() {
        this.filterVars = {
            glow: {
                active: {
                    brightness: 1,
                    bloomScale: 1,
                },
                inactive: {
                    brightness: 0.8,
                    bloomScale: 0.6,
                }
            },
            bevel: {
                active: {
                    rotation: 225
                },
                inactive: {
                    rotation: 45
                }
            }
        }

        this.glowFilter = new AdvancedBloomFilter({
            threshold: 0,
            brightness: this.filterVars.glow.inactive.brightness,
            bloomScale: this.filterVars.glow.inactive.bloomScale,
            blur: 5,
            quality: 14
        })

        this.glowFilter.padding = 20
        this.icon.filters = [this.glowFilter]

        this.bevelFilter = new BevelFilter({
            thickness: 5,
            lightColor: 0x4f4f4f,
            lightAlpha: 0.4,
            shadowColor: 0x050505,
            shadowAlpha: 0.4,
        })

        this.filters = [this.bevelFilter]
    }

    updateFilterValues(filter, values) {
        for (const [name, value] of Object.entries(values)) {
            filter[name] = value
        }
    }

    onMouseOver() {
        this.updateFilterValues(this.glowFilter, this.filterVars.glow.active)
    }

    onMouseOut() {
        if (!this.isPressed) {
            this.updateFilterValues(this.glowFilter, this.filterVars.glow.inactive)
        }
    }

    onMouseDown() {
        this.icon.x += 0.5
        this.icon.y += 0.5
        this.updateFilterValues(this.bevelFilter, this.filterVars.bevel.active)
    }

    onMouseUp() {
        this.icon.x -= 0.5
        this.icon.y -= 0.5
        this.updateFilterValues(this.bevelFilter, this.filterVars.bevel.inactive)
        
        if (!this.isHover) {
            this.updateFilterValues(this.glowFilter, this.filterVars.glow.inactive)
        }
    }
}
