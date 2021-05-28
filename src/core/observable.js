
export default function Observable(v = undefined) {
    let value = v
    let callbacks = []

    function runCallbacks() { 
        callbacks.forEach(cb => cb(value))
    }
    
    function observable() {
        if (arguments.length > 0) {
            value = arguments[0]
            runCallbacks()
        }
        
        return value
    }

    observable.subscribe = function(cb) { 
        callbacks.push(cb) 
    }
    observable.removeListener = function(cb) { 
        callbacks = callbacks.filter(other => other !== cb) 
    }

    return observable
}
