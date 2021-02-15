import * as PIXI from "pixi.js"
import { Container } from "pixi.js"
import { ShaderInterface } from "./shadersInterface"

export class Shaders extends Container {

    constructor() {
        super()
    }

    laser(fromPosition, toPosition) {
        this.removeChildren()

        let length = fromPosition.distance(toPosition)
        let angle = fromPosition.angle(toPosition)

        const geometry = new PIXI.Geometry()
            .addAttribute('aVertexPosition',
                [0, -50,
                length, -50,
                length, 50,
                0, 50],
                2)
            .addAttribute('aUvs',
                [0, 0, 1, 0, 1, 1, 0, 1],
                2)
            .addIndex([0, 1, 2, 0, 2, 3])

        const vertexSrc = ShaderInterface.vertexSrc_lasertower
        const fragmentGridSrc = ShaderInterface.fragmentSrc_lasertower

        const gridUniforms = {
            zoom: 50,
        }
        const shaderA = PIXI.Shader.from(vertexSrc, fragmentGridSrc, gridUniforms)
        const gridQuad = new PIXI.Mesh(geometry, shaderA)

        gridQuad.position.set(fromPosition.x, fromPosition.y)
        gridQuad.rotation = angle

        this.addChild(gridQuad)
    }
}
