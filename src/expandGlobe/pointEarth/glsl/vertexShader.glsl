attribute float size;
varying vec4 worldPosition;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    worldPosition = mvPosition;

    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}
