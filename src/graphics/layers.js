import { Container } from "pixi.js"
import LayerList from "./layerList"

class Layer extends Container {
    constructor(level) {
        super()
        this.level = level
    }
}

export default class Layers extends Container {
    addChild(object, level) {
        if (typeof level === "string") {
            const name = level
            level = LayerList.indexOf(name)

            if (level < 0) {
                throw new Error(`Unknown layer name "${name}"`)
            }
        }

        const layer = this.ensureLayer(level)
        layer.addChild(object)
    }

    removeChild(object) {
        for (const layer of this.children) {
            if (layer.children.find(obj => obj === object)) {
                layer.removeChild(object)
            }
        }        
    }

    ensureLayer(level) {
        // If no level is provided, get the current highest and insert this 
        // one above it, making it the utmost layer
        if (typeof level !== "number" && this.children.length > 0) {
            // || 1, since if we start adding children without level, we'd keep having NaN
            level = this.children[this.children.length - 1].level + 1 || 1
        }

        let layer = this.children.find(l => l.level === level)

        if (!layer) {
            layer = new Layer(level)
            Container.prototype.addChild.call(this, layer)
            this.children.sort((a, b) => a.level < b.level ? -1 : 1)
        }

        return layer
    }

    getLayer(level) {
        return this.ensureLayer(level)
    }
}
