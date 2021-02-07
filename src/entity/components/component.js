
export default class Component {
    static __Name = null

    constructor(entity) {
        this.entity = entity
        this.name = this.constructor.__Name
    }

    setup(options) {}
    close() {}

    update(delta) {}
    postUpdate() {}
}
