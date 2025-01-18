import * as THREE from 'three';
import globePoints from './border-pixel.json';
import {
  returnMapBorderSphericalCoordinates,
} from '../../utils';
import props from '../../props';
import pointVertexShader from './glsl/vertexShader.glsl';
import pointFragmentShader from './glsl/fragmentShader.glsl';

function Init(scene) {
  const vertices = [];
  // points
  globePoints.forEach((point) => {
    if (point.y < (props.mapBorderSize.height * 2 - 8)) {
      const vector = returnMapBorderSphericalCoordinates(point.x, point.y);
      vertices.push(vector);
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
    sizes[ i ] = 10;
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

  return spherePoints;
}

export default {
  Init,
};
