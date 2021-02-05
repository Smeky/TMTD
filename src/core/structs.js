

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

    add(other) {
        return new Vec2(
            this.x + other.x,
            this.y + other.y
        )
    }

    subtract(other) {
        return new Vec2(
            this.x - other.x,
            this.y - other.y
        )
    }

    multiply(other) {
        return new Vec2(
            this.x * other.x,
            this.y * other.y
        )
    }

    length() {
        return Math.hypot(this.x, this.y)
    }

    normalize() {
        const length = this.length()

        return new Vec2(
            this.x * (1.0 / length),
            this.y * (1.0 / length),
        )
    }

    dot(other) {
        return this.x * other.x + this.y * other.y
    }

    angle(other) {
        return Math.atan2(other.y - this.y, other.x - this.x)
    }

    distance(other) {
        return Math.sqrt((other.x - this.x) ** 2 + (other.y - this.y) ** 2)
    }

    apply(func) {
        return new Vec2(
            func(this.x),
            func(this.y),
        )
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

    split() {
        return [
            new Vec2(this.x, this.y),
            new Vec2(this.w, this.h),
        ]
    }
}
