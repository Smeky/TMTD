

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
            this.w = x.w
            this.h = x.h
        }
        else {
            this.x = x
            this.y = y
            this.w = w
            this.h = h
        }
    }
}
