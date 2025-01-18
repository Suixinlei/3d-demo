uniform sampler2D texture;
uniform float time;
varying vec4 worldPosition;

void main() {
    float xwave = worldPosition.x + time / 50.;

    float heights = 5.;
    float pi = 3.14159265359;
    float wave = sin(heights * 2. * pi * xwave );
    wave = (wave + 1. ) / 2.;

    gl_FragColor = vec4(vec3(0, wave, wave), 1.);
    gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
}
