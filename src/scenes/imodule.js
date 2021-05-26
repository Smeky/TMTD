export default class IModule {
    constructor(scene) {
        this.scene = scene
    }

    async load() {}
    
    setup() {}
    close() {}

    update(delta) {}
}
