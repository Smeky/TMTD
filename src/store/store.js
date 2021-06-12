
export default class Store {
    constructor(defaultState) {
        this.state = { ...defaultState }
        this.callbacks = []
    }
    
    update(action) {
        this.state = {
            ...this.state,
            ...action(this.state)
        }

        this.invoke()
    }

    subscribe(callback) {
        this.callbacks.push(callback)
    }

    removeListener(callback) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback)
    }

    invoke() {
        this.callbacks.forEach(cb => cb(this.state))
    }
}
