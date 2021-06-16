/**
 * @abstract
 */
 export default class ECSSystem {
    constructor(controller) {
        this.ecs = controller
    }

    setupComponents(entity) {}
    updateEntity(delta, entity, entities) {}
    closeComponents(entity) {}
}
