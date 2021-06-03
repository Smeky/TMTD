import { ECSSystem } from ".";

export default class TowerActionController extends ECSSystem {
    static Dependencies = ["tower", "tower_action"]
    
    updateEntity(delta, entity, entities) {

    }
}
