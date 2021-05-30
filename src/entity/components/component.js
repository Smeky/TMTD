
export default class Component {
    constructor(entity, options) {
        this.entity = entity
        this.dependencies = {}
    }

    setup() {}
    close() {}

    update(delta) {}
    postUpdate() {}

    setDependencyComponents(dependencies) {
        this.dependencies = { ...dependencies }
    }

    setName(name) { this.name = name }
}
