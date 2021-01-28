

/** Vector2 class represents a 2D point */
export class Vec2 {
    /**
     * Creates a Vec2
     * @param {number|object} x
     * @param {number} y
     */
    constructor(x = 0, y = 0) {
        // Passing down an object literal - {x, y}
        if (typeof x === "object") {
            this.x = x.x
            this.y = x.y
        }
        else {
            this.x = x
            this.y = y
        }
    }
}

/** Rect class represents both 2D position and size */
export class Rect {
    /**
     * Creates a Rect
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     */
    constructor(x = 0, y = 0, w = 0, h = 0) {
        if (typeof x === "object") {
            this.x = x.x
            this.y = x.y

            // pixi.Rectangle
            if (x.hasOwnProperty("width")) {
                this.w = x.width
                this.h = x.height
            }
        }
        else {
            this.x = x
            this.y = y
            this.w = w
            this.h = h
        }
    }

    compare(other) {
        if (this.x !== other.x || this.y !== other.y) return false

        // pixi.Rectangle
        if (other.hasOwnProperty("width")) {
            if (this.w !== other.width || this.h !== other.height) return false
        }
        else {
            if (this.w !== other.w || this.h !== other.h) return false
        }

        return true
    }
}
