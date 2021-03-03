
export default class Tile {
    static Size = 32

    constructor(pos, sprite) {
        this.pos = pos

        this.sprite = sprite
        this.sprite.x = this.pos.x
        this.sprite.y = this.pos.y
    }
}
