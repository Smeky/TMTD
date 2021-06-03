/**
 * @abstract
 */
 export default class ECSSystem {
    setupEntity(entity) {}
    updateEntity(delta, entity, entities) {}
    closeEntity(entity) {}
}
