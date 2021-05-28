import { multiplyMapper, divideMapper } from "game/mappers/math"

/*
    Important:
        class Color currently doesn't calculate colors properly when adding, subtracting,
        .. other colors. 
        It's a todo..
*/
export default class Color {
    static fromHex(hex) {
        // https://stackoverflow.com/a/11508164
        const r = (hex >> 16) & 255
        const g = (hex >> 8) & 255
        const b = hex & 255

        return new Color(r, g, b)
    }

    constructor(r = 0, g = 0, b = 0, a = 255) {
        if (Array.isArray(r)) {
            if (r.length === 3) {
                this.rgb = r.slice(0, 3)
                this.alpha = r[3]
            }
            else {
                this.rgb = [...r]
                this.alpha = a
            }
        }
        else {
            this.rgb = [r, g, b]
            this.alpha = a
        }
    }

    set r(v) { this.rgb[0] = v }
    get r() { return this.rgb[0] }
    
    set g(v) { this.rgb[1] = v }
    get g() { return this.rgb[1] }
    
    set b(v) { this.rgb[2] = v }
    get b() { return this.rgb[2] }
    
    toString() {
        // Convert each color into a hexa string (00-ff), prepend with 0 if needed
        // and spit out concated string of all three
        return this.rgb.reduce((str, color) => {
            const strColor = color.toString(16)
            return str + (strColor.length < 2 ? "0" + strColor : strColor)
        }, "")
    }

    toHex() {
        const [r, g, b] = this.rgb
        
        // According to docs of parseInt():
        //    - If the string begins with "0x", the radix is 16 (hexadecimal)
        return parseInt("0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1))
    }

    multiply(r, g, b) {
        const multiplier = arguments.length === 1 ? r : [r, g, b]
        return new Color(this.rgb.map(multiplyMapper(multiplier)).map(Math.round))
    }

    divide(r, g, b) {
        const divider = arguments.length === 1 ? r : [r, g, b]
        return new Color(this.rgb.map(divideMapper(divider)).map(Math.round))
    }
}
