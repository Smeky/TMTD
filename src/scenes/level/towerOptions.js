import utils from "game/utils"
import { Rect, Vec2 } from "game/graphics"
import { ButtonBase } from "game/ui"
import { createCrossIcon, createUpgradeIcon } from "game/ui/icons"
import { Container, Sprite } from "pixi.js"
import { AdvancedBloomFilter, BevelFilter } from "pixi-filters"


// Todo: this is a torus button (part of donut-like circle), move it somewhere
// class OptionsButton extends ButtonBase {
//     constructor(options = {}) {
//         super()
        
//         this.interactive = true
//         this.icon = null
//         this.glowFilter = null

//         this.options = {
//             ...options,
//         }

//         const { fromAngle, toAngle, padding } = this.options
//         const angleSize = toAngle - fromAngle

//         this.x = Math.cos(fromAngle + angleSize / 2) * padding
//         this.y = Math.sin(fromAngle + angleSize / 2) * padding

//         this.setupBackground()

//         if (this.options.icon) {
//             this.setIcon(this.options.icon)
//         }
//     }

//     setupBackground() {
//         const { innerRad, outerRad, fromAngle, toAngle } = this.options

//         this.bg = new Graphics()
//         this.bg.beginFill(0xffffff)
//         // this.bg.drawTorus(0, 0, innerRad, outerRad, fromAngle, toAngle)
//         this.bg.endFill()
//         this.bg.tint = 0x181818

//         this.bgBevelFilter = new BevelFilter({
//             thickness: 3,
//             lightColor: 0x4f4f4f,
//             lightAlpha: 0.3,
//             shadowColor: 0x050505,
//             shadowAlpha: 0.3,
//         })

//         this.filters = [this.bgBevelFilter]
//         this.addChild(this.bg)
//     }

//     setupFilters() {
//         this.glowFilter = new AdvancedBloomFilter({
//             threshold: 0,
//             blur: 4,
//             quality: 14
//         })

//         this.glowFilter.padding = 20
//     }

//     onMouseOver() {
//         if (this.glowFilter) {
//             this.glowFilter.bloomScale = 2
//         }
//     }

//     onMouseOut() {
//         if (this.glowFilter && !this.isPressed) {
//             this.glowFilter.bloomScale = 1
//         }
//     }

//     onMouseDown() {
//         this.bg.tint = 0x252525
//         this.bgBevelFilter.rotation = 225

//         if (this.icon) {
//             this.icon.x += 1
//             this.icon.y += 1
//         }
//     }

//     onMouseUp() {
//         this.bg.tint = 0x181818
//         this.bgBevelFilter.rotation = 45

//         if (this.icon) {
//             this.icon.x -= 1
//             this.icon.y -= 1
//         }

//         if (this.glowFilter && !this.isHover) {
//             this.glowFilter.bloomScale = 1
//         }
//     }

//     setIcon(icon) {
//         if (this.icon) {
//             this.removeChild(this.icon)
//         }
//         else {
//             this.setupFilters()
//         }
        
//         this.icon = icon
//         this.addChild(icon)

//         const { innerRad, outerRad, fromAngle, toAngle } = this.options
        
//         const angleSize = toAngle - fromAngle
//         const center = innerRad + (outerRad - innerRad) / 2
        
//         this.icon.x = Math.round(Math.cos(fromAngle + angleSize / 2) * center)
//         this.icon.y = Math.round(Math.sin(fromAngle + angleSize / 2) * center)
//         this.icon.scale.set(1.2, 1.2)
//         this.icon.filters = [this.glowFilter]
//     }
// }

class OptionsButton extends ButtonBase {
    constructor(icon, size) {
        super()

        this.icon = icon
        this.icon.position.copyFrom(size.divide(2))

        const texture = utils.createRectTexture(new Rect(0, 0, size.x, size.y), 0xffffff)
        this.bg = new Sprite(texture)
        this.bg.tint = 0x20212b

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

export default class TowerOptions extends Container {
    constructor() {
        super()

        const size = new Vec2(50)

        const buttons = [
            { id: "upgrade", icon: createUpgradeIcon(0xffeb74, 4) },
            { id: "remove", icon: createCrossIcon(0xa20e0e, 4) },
        ]
        .forEach((meta, index) => {
            const angle = Math.PI * 1.9 + index * (Math.PI * 0.32)
            const button = new OptionsButton(meta.icon, size)

            button.pivot.copyFrom(size.divide(2))
            button.x = Math.cos(angle) * 75
            button.y = Math.sin(angle) * 75
            button.on("click", () => this.emit("click", meta.id))
    
            this.addChild(button)
        })
    }

    setCenter(center) {
        this.position.copyFrom(center)
    }
}