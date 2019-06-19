uniform sampler2D texture;
uniform float time;
varying vec4 worldPosition;

void main() {
    float sameColor = abs(cos(sin(abs(worldPosition.x * worldPosition.x + worldPosition.y * worldPosition.y + worldPosition.z * worldPosition.z) + time / 2.0)));

    gl_FragColor = vec4(0.0, sameColor, sameColor, 1.0);
    gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
}
