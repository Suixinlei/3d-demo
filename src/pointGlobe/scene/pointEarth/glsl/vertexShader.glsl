attribute float size;
varying vec3 vColor;
varying vec4 vUv;

void main() {
    vColor = color;
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}
