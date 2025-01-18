import * as THREE from 'three';
import globePoints from './map2-pixel.json';
import props from '../../props';
import {
  returnSphericalCoordinates,
} from '../../utils';
import pointVertexShader from './glsl/vertexShader.glsl';
import pointFragmentShader from './glsl/fragmentShader.glsl';

const uniforms = {
  time: { type: "f", value: 0 },
  resolution: { type: "v2", value: new THREE.Vector2 },
  texture: { value: new THREE.TextureLoader().load('https://img.alicdn.com/tfs/TB1toJmbET1gK0jSZFrXXcNCXXa-256-256.png') }
};

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
    sizes[ i ] = 8;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
  geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
  const pointMaterial = new THREE.ShaderMaterial( {
    uniforms,
    vertexShader: pointVertexShader,
    fragmentShader: pointFragmentShader,
    transparent: true,
    vertexColors: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });

  const spherePoints = new THREE.Points(geometry, pointMaterial);
  scene.add(spherePoints);

  return spherePoints;
}

function update(delta) {
  // uniforms.time.value = 0.20;
  uniforms.time.value += delta * 5
}

export default {
  Init,
  update,
};
