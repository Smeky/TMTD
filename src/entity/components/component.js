
export default class Component {
    constructor(entity) {
        this.entity = entity
        this.name = null
    }

    setup(options) {}
    close() {}

    update(delta) {}
    postUpdate() {}

    setName(name) { this.name = name }
}
