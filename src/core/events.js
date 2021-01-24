
class EventProxy {
    constructor(id, handler) {
        this.id = id
        this.handler = handler
        this.callbacks = [] // Tuples of (event, callback)
    }

    listen(event, callback) {
        this.callbacks.push([event, callback])
        this.handler.listen(event, callback)
    }

    leave(callback) {
        const index = this.callbacks.findIndex(([_, cb]) => cb === callback)
        const [event, cb] = this.callbacks.splice(index, 1)[0]
        this.handler.leave(event, cb)
    }
    
    close() {
        // Todo:optimize: This can be heavy, store events under proxies in the handler instead
        this.callbacks.forEach(([event, cb]) => this.handler.leave(event, cb))
        this.handler.removeProxy(this)
    }
}

export default class EventHandler {
    constructor() {
        // {event-name: [], ...}
        this.proxies = []
        this.proxyIdCounter = 1 // Todo:id: Replace by proper ID
    }

    _doesBelongToCanvas(event) {
        return ["mousemove"].includes(event)
    }

    getProxy() {
        const proxy = new EventProxy(this.proxyIdCounter++, this)
        this.proxies.push(proxy)

        return proxy
    }

    removeProxy(proxy) {
        const index = this.proxies.findIndex(p => p.id === proxy.id)
        this.proxies.splice(index, 1)
    }

    listen(event, callback) {
        // Events that should be trigger only from the canvas DOM
        if (this._doesBelongToCanvas(event)) {
            // Todo: move to constructor (might cause troubles with pixi app not being running yet)
            const el = document.getElementsByTagName("canvas")[0]
            el.addEventListener(event, callback)
        }
        else {
            document.body.addEventListener(event, callback)
        }
    }

    leave(event, callback) {
        if (this._doesBelongToCanvas(event)) {
            const el = document.getElementsByTagName("canvas")[0]
            el.removeEventListener(event, callback)

        }
        else {
            document.body.removeEventListener(event, callback)
        }
    }
}