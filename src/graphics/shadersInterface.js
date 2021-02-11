export class ShaderInterface {
    static vertexSrc_lasertower = `
        precision mediump float;

        attribute vec2 aVertexPosition;
        attribute vec2 aUvs;

        uniform mat3 translationMatrix;
        uniform mat3 projectionMatrix;

        varying vec2 vUvs;

        void main() {

            vUvs = aUvs;
            gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

        }`

    static fragmentSrc_lasertower = `
        precision mediump float;
        varying vec2 vUvs;
        uniform float zoom;

        void main()
        {
            vec2 uv = (vUvs-vec2(0.5))*2.0;
            vec2 gUv = uv*zoom;

            vec3 colorRed = vec3(217./255., 40./255., 2./255.);

            float beamWidth = abs(1.0 / (30.0 * uv.y));
            vec3 horBeam = vec3(beamWidth);

            vec4 beam = vec4((( horBeam) * colorRed), 1);

            if(abs(gUv.y) > 3.)
            discard;

            gl_FragColor = beam;
            
        }`
}