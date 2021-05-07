
export default class Component {
    constructor(entity, options) {
        this.entity = entity
        this.name = null
    }

    setup() {}
    close() {}

    update(delta) {}
    postUpdate() {}

    setName(name) { this.name = name }
}
