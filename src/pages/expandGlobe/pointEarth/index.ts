import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import globePoints from './map2-pixel.json';
import props from '../props';
import {
  returnSphericalCoordinates,
} from '../utils';
import pointVertexShader from './glsl/vertexShader.glsl';
import pointFragmentShader from './glsl/fragmentShader.glsl';

let spherePoints: THREE.Points;
let spherePositions: Float32Array;
let planePosition: THREE.Vector3;

interface Point {
  x: number;
  y: number;
}

const uniforms = {
  time: { type: "f", value: 0 },
  resolution: { type: "v2", value: new THREE.Vector2() },
  texture: { value: new THREE.TextureLoader().load( "/images/particle.png" ) }
};

function addPoint(point: Point): THREE.Vector3 {
  const vector = returnSphericalCoordinates(point.x, point.y);
  return vector;
}

function Init(scene: THREE.Scene): THREE.Points {
  const vertices: THREE.Vector3[] = [];
  // points
  globePoints.forEach((point: Point) => {
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
  const colors: number[] = [];
  const sizes = new Float32Array( vertices.length );

  let vertex: THREE.Vector3;
  const color = new THREE.Color();
  for ( let i = 0; i < verticesLength; i++ ) {
    vertex = vertices[ i ];
    vertex.toArray( positions, i * 3 );

    color.setHex(0x00ffff);
    color.toArray( colors, i * 3 );
    sizes[ i ] = 8;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
  geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
  const pointMaterial = new THREE.ShaderMaterial( {
    uniforms,
    vertexShader: pointVertexShader,
    fragmentShader: pointFragmentShader,
    transparent: true,
    vertexColors: THREE.VertexColors,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });

  spherePoints = new THREE.Points(geometry, pointMaterial);
  scene.add(spherePoints);

  return spherePoints;
}

function expand(): void {
  const startX = - props.mapSize.width;
  const startY = props.mapSize.height;
  const planeVertices: number[][] = [];
  globePoints.forEach((point: Point) => {
    planeVertices.push([
      startX + point.x,
      startY - point.y,
      props.initCameraDistance - 620,
    ]);
  });

  const originalVertices: number[][] = [];
  const verticesCount = spherePoints.geometry.attributes.position.count;

  const tween = new TWEEN.Tween({ x: 0 }).to({ x: 1 }, 2000)
    // .yoyo(true)
    // .repeat( Infinity );
  tween.easing(TWEEN.Easing.Sinusoidal.InOut);
  tween.onStart(() => {
    const p = spherePoints.geometry.attributes.position.array as Float32Array;
    spherePoints.geometry.attributes.position.needsUpdate = true;
    for (let i = 0; i < verticesCount; i++) {
      originalVertices.push([
        p[i * 3],
        p[i * 3 + 1],
        p[i * 3 + 2],
      ]);
    }
  });
  tween.onUpdate(function(this: { x: number }) {
    const p = spherePoints.geometry.attributes.position.array as Float32Array;
    spherePoints.geometry.attributes.position.needsUpdate = true;
    for (let i = 0; i < verticesCount; i++) {
      const originalPosition = new THREE.Vector3(...originalVertices[i]);
      const targetPosition = new THREE.Vector3(...planeVertices[i]).multiplyScalar(2);
      const currentPositon = originalPosition.lerp(targetPosition, this.x);
      p[i * 3] = currentPositon.x;
      p[i * 3 + 1] = currentPositon.y;
      p[i * 3 + 2] = currentPositon.z;
    }
  });
  tween.start();
}

function zeroExpand(): void {
  const zero = new THREE.Vector3(0, 0, 0);
  const startX = - props.mapSize.width;
  const startY = props.mapSize.height;
  const planeVertices: number[][] = [];
  globePoints.forEach((point: Point) => {
    planeVertices.push([
      startX + point.x,
      startY - point.y,
      props.initCameraDistance - 620,
    ]);
  });

  const originalVertices: number[][] = [];
  const verticesCount = spherePoints.geometry.attributes.position.count;

  const tween = new TWEEN.Tween({ x: 0 }).to({ x: 1 }, 5000).yoyo(true).repeat( Infinity );
  tween.easing(TWEEN.Easing.Sinusoidal.InOut);
  tween.onStart(() => {
    const p = spherePoints.geometry.attributes.position.array as Float32Array;
    spherePoints.geometry.attributes.position.needsUpdate = true;
    for (let i = 0; i < verticesCount; i++) {
      originalVertices.push([
        p[i * 3],
        p[i * 3 + 1],
        p[i * 3 + 2],
      ]);
    }
  });
  tween.onUpdate(function(this: { x: number }) {
    const p = spherePoints.geometry.attributes.position.array as Float32Array;
    spherePoints.geometry.attributes.position.needsUpdate = true;
    for (let i = 0; i < verticesCount; i++) {
      const targetPosition = new THREE.Vector3(...planeVertices[i]).multiplyScalar(2);
      const currentPositon = zero.lerp(targetPosition, this.x);
      p[i * 3] = currentPositon.x;
      p[i * 3 + 1] = currentPositon.y;
      p[i * 3 + 2] = currentPositon.z;
    }
  });
  tween.start();
}

function update(delta: number): void {
  // uniforms.time.value = 0.20;
  uniforms.time.value += delta * 5;
}

export default {
  Init,
  expand,
  zeroExpand,
  update,
}