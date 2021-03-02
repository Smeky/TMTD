import { ButtonBase } from "game/ui"
import { createCrossIcon, createUpgradeIcon } from "game/ui/icons"
import { AdvancedBloomFilter, BevelFilter } from "pixi-filters"
import { Container, Graphics } from "pixi.js"

class OptionsButton extends ButtonBase {
    constructor(options = {}) {
        super()
        
        this.interactive = true
        this.icon = null
        this.iconGlowFilter = null

        this.options = {
            ...options,
        }

        const { fromAngle, toAngle, padding } = this.options
        const angleSize = toAngle - fromAngle

        this.x = Math.cos(fromAngle + angleSize / 2) * padding
        this.y = Math.sin(fromAngle + angleSize / 2) * padding

        this.setupBackground()

        if (this.options.icon) {
            this.setIcon(this.options.icon)
        }
    }

    setupBackground() {
        const { innerRad, outerRad, fromAngle, toAngle } = this.options

        this.bg = new Graphics()
        this.bg.beginFill(0xffffff)
        this.bg.drawTorus(0, 0, innerRad, outerRad, fromAngle, toAngle)
        this.bg.endFill()
        this.bg.tint = 0x181818

        this.bgBevelFilter = new BevelFilter({
            thickness: 3,
            lightColor: 0x4f4f4f,
            lightAlpha: 0.3,
            shadowColor: 0x050505,
            shadowAlpha: 0.3,
        })

        this.filters = [this.bgBevelFilter]
        this.addChild(this.bg)
    }

    setupFilters() {
        this.iconGlowFilter = new AdvancedBloomFilter({
            threshold: 0,
            blur: 4,
            quality: 14
        })

        this.iconGlowFilter.padding = 20
    }

    onMouseOver() {
        if (this.iconGlowFilter) {
            this.iconGlowFilter.bloomScale = 2
            // this.iconGlowFilter.brightness = 2
        }
    }

    onMouseOut() {
        if (this.iconGlowFilter) {
            this.iconGlowFilter.bloomScale = 1
            // this.iconGlowFilter.brightness = 1
        }
    }

    onMouseDown() {
        this.bg.tint = 0x252525
        this.bgBevelFilter.rotation = 225

        if (this.icon) {
            this.icon.x += 1
            this.icon.y += 1
        }
    }

    onMouseUp() {
        this.bg.tint = 0x181818
        this.bgBevelFilter.rotation = 45

        if (this.icon) {
            this.icon.x -= 1
            this.icon.y -= 1
        }
    }

    setIcon(icon) {
        if (this.icon) {
            this.removeChild(this.icon)
        }
        else {
            this.setupFilters()
        }
        
        this.icon = icon
        this.addChild(icon)

        const { innerRad, outerRad, fromAngle, toAngle } = this.options
        
        const angleSize = toAngle - fromAngle
        const center = innerRad + (outerRad - innerRad) / 2
        
        this.icon.x = Math.round(Math.cos(fromAngle + angleSize / 2) * center)
        this.icon.y = Math.round(Math.sin(fromAngle + angleSize / 2) * center)
        this.icon.scale.set(1.2, 1.2)
        this.icon.filters = [this.iconGlowFilter]
    }
}

export default class TowerOptions extends Container {
    constructor() {
        super()

        const buttonMeta = [
            { id: "", icon: null },
            { id: "remove", icon: createCrossIcon(0xa20e0e) },
            { id: "", icon: null },
            { id: "", icon: null },
            { id: "upgrade", icon: createUpgradeIcon(0xffeb74) },
        ]

        const innerRad = 50
        const outerRad = 100
        const pieceAngle = ((Math.PI * 2) / 5)
        
        for (let i = 0; i < 5; i++) {
            const angle = i * pieceAngle

            const button = new OptionsButton({
                innerRad: innerRad,
                outerRad: outerRad,
                fromAngle: angle,
                toAngle: (i + 1) * pieceAngle,
                padding: 5,
                icon: buttonMeta[i].icon,
            })

            button.on("click", () => {
                this.emit("click", buttonMeta[i].id)
            })

            this.addChild(button)
        }
    }

    setCenter(center) {
        this.position.copyFrom(center)
    }
}