/** Vector2 class represents a 2D point */
export default class Vec2 {
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
            if (arguments.length === 1) {
                this.x = x
                this.y = x
            }
            else {
                this.x = x
                this.y = y
            }
        }
    }

    copyFrom(other) {
        this.x = other.x
        this.y = other.y

        return this
    }

    copyTo(other) {
        other.x = this.x
        other.y = this.y

        return other
    }

    equals(other) {
        return this.x === other.x && this.y === other.y
    }

    add(other) {
        if (typeof other === "object") {
            return new Vec2(
                this.x + other.x,
                this.y + other.y
            )
        }
        else {
            return new Vec2(
                this.x + other,
                this.y + other
            )
        }
    }

    /**
     * 
     * @param {Vec2|number} other 
     * @returns {Vec2}
     */
    subtract(other) {
        if (typeof other === "object") {
            return new Vec2(
                this.x - other.x,
                this.y - other.y
            )
        }
        else {
            return new Vec2(
                this.x - other,
                this.y - other
            )
        }
    }

    multiply(other) {
        if (typeof other === "object") {
            return new Vec2(
                this.x * other.x,
                this.y * other.y
            )
        }
        else {
            return new Vec2(
                this.x * other,
                this.y * other
            )
        }
    }

    divide(other) {
        if (typeof other === "object") {
            return new Vec2(
                this.x / other.x,
                this.y / other.y
            )
        }
        else {
            return new Vec2(
                this.x / other,
                this.y / other
            )
        }
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

    round() {
        return new Vec2(
            Math.round(this.x),
            Math.round(this.y),
        )
    }
}
