import EventEmitter from "eventemitter3"

// Hacky solution but works
export default function Observable(v = undefined) {
    const emitter = new EventEmitter()
    let value = v
    
    function observable() {
        if (arguments.length > 0) {
            value = arguments[0]
            emitter.emit("change", value)
        }
        
        return value
    }

    observable.on = (...args) => emitter.on(...args)
    observable.once = (...args) => emitter.once(...args)
    observable.removeListener = (...args) => emitter.removeListener(...args)

    return observable
}
