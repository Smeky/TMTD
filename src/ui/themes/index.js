import { AdvancedBloomFilter, GlowFilter } from "pixi-filters"

const DefaultColors = {
    main: 0x45b1ed,
    dark: 0x1a61cb,
    inventory: {
        slotEmpty: 0x40464a,
        slotFilledGeneric: 0x7a858c,
    }
}

const glowFilter = new AdvancedBloomFilter({
    threshold: 0,
    brightness: 0.8,
    blur: 1,
})
glowFilter.padding = 5

const DefaultTheme = {
    colors: DefaultColors,
    filters: {
        glow: glowFilter
    }
}

const CurrentTheme = DefaultTheme
export default CurrentTheme
