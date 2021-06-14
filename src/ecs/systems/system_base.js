/**
 * @abstract
 */
 export default class ECSSystem {
    setupComponents(entity) {}
    updateEntity(delta, entity, entities) {}
    closeComponents(entity) {}
}
