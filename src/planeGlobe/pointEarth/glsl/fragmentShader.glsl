uniform sampler2D texture;
uniform float time;
varying vec4 worldPosition;

void main() {
    gl_FragColor = vec4(vec3(0, 1, 1), 1.);
    gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
}
