uniform sampler2D texture;
uniform float time;
varying vec3 vColor;
varying vec2 vUv;

void main() {
//    gl_FragColor = vec4( vColor, 1.0 );
//    gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
    vec2 position = -1.0 + 2.0 * vUv;

    float sameColor = abs(position.x * position.y + sin(time) / 3.0);
    float green = abs(sin(position.x * position.y + time / 3.0));
    float blue = abs(sin(position.x * position.y + time / 3.0 ));

    gl_FragColor = vec4(0.0, sameColor, sameColor, 1.0);
    gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
}
