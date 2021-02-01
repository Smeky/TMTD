
export class EntityHandler {
    constructor() {
        // Todo:test: Replace with a test please
        if (process.env.NODE_ENV === "development") {
            this.constructor.createComponent() // will throw if not overrided
        }
    }

    static createComponent() { throw "EntityHandler.createComponent must be overrided!" }

    initComponent(entity) {}
    update(entities, delta) {}
    close() {}
}
