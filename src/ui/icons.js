import { Graphics } from "pixi.js"

const IconSize = 20

export function createCrossIcon(color, width = 2) {
    const icon = new Graphics()
    const halfSize = IconSize * 0.45

    icon.lineStyle(width, color)
    icon.moveTo(-halfSize, -halfSize)
    icon.lineTo( halfSize,  halfSize)
    icon.moveTo(-halfSize,  halfSize)
    icon.lineTo( halfSize, -halfSize)
    icon.endFill()

    return icon
}

export function createUpgradeIcon(color, width = 2) {
    const icon = new Graphics()
    const halfSize = IconSize / 2

    icon.lineStyle(width, color)
    icon.moveTo(0, - halfSize)
    icon.lineTo(0,   halfSize)

    icon.moveTo(- IconSize / 2.5, 0)
    icon.lineTo(width / 4, - halfSize * 1.1)

    icon.moveTo(IconSize / 2.5, 0)
    icon.lineTo(-width / 4, - halfSize * 1.1)

    icon.endFill()

    return icon
}