
export class EntityHandler {
    constructor(name) {
        this.name = name

        // Todo:test: Replace with a test please
        if (process.env.NODE_ENV === "development") {
            if (typeof this.name !== "string") {
                throw "Invalid handler name"
            }
        }
    }

    initComponent(entity) {}
    closeComponent(entity) {}
    update(entities, delta) {}
    close() {}
}
