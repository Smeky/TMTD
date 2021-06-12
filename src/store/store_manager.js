import { Store } from "."

export default class StoreManager {
    constructor() {
        this.stores = {}
    }

    addStore(name, state) {
        this.stores[name] = new Store(state)
    }
}
