const THREE = require('three');
const globePoints = require('./map2-pixel.json');
const props = require('../../props');
const {
  returnSphericalCoordinates,
} = require('../../utils');
const pointVertexShader = require('./glsl/vertexShader.glsl');
const pointFragmentShader = require('./glsl/fragmentShader.glsl');

function addPoint(point) {
  const vector = returnSphericalCoordinates(point.x, point.y);
  return vector;
}

function Init(scene) {
  const vertices = [];
  // points
  globePoints.forEach((point) => {
    if (point.y < (props.mapSize.height * 2 - 8)) {
      vertices.push(addPoint(point));
    } else {
      // 特密点特殊处理
      if (point.x % 2 === 0) {
        vertices.push(addPoint(point));
      }
    }
  });

  const verticesLength = vertices.length;
  const positions = new Float32Array( vertices.length * 3 );
  var colors = [];
  var sizes = new Float32Array( vertices.length );

  let vertex;
  var color = new THREE.Color();
  for ( var i = 0, l = verticesLength; i < l; i ++ ) {
    vertex = vertices[ i ];
    vertex.toArray( positions, i * 3 );

    color.setHex(0x00ffff);
    colors.push(colors);
    color.toArray( colors, i * 3 );
    sizes[ i ] = 6;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
  geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
  const pointMaterial = new THREE.ShaderMaterial( {
    uniforms: {
      texture: { value: new THREE.TextureLoader().load( "/images/particle.png" ) }
    },
    vertexShader: pointVertexShader,
    fragmentShader: pointFragmentShader,
    transparent: true,
    vertexColors: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });

  const spherePoints = new THREE.Points(geometry, pointMaterial);
  scene.add(spherePoints);
}

module.exports = {
  Init,
};
