import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';
import TWEEN from 'tween';

import props from './props';
import pointEarth from './pointEarth/index';

let scene: THREE.Scene;
let camera: THREE.Camera;
let renderer: THREE.Renderer;
let stats: Stats;

let clock: THREE.Clock;

function Init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );
  camera.position.z = props.initCameraDistance;
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({ alpha: false });
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // stats
  stats = new Stats();
  document.body.appendChild( stats.dom );

  // clock
  clock = new THREE.Clock();

  // 环境光
  const ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
  scene.add( ambient );

  // 点状光源
  const pointLight = new THREE.PointLight( 0xff0000, 5, 1000);
  pointLight.position.set( 0, 0, 0 );
  scene.add( pointLight );
}

function userInit(type: string) {
  pointEarth.Init(scene);

  // 先让相机自转一周
  const startRotation = {angle: 0};
  const endRotation = {angle: Math.PI * 2};
  
  new TWEEN.Tween(startRotation)
    .to(endRotation, 2000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(() => {
      const x = props.initCameraDistance * Math.sin(startRotation.angle);
      const z = props.initCameraDistance * Math.cos(startRotation.angle);
      camera.position.set(x, 0, z);
      camera.lookAt(0, 0, 0);
    })
    .onComplete(() => {
      camera.position.set(0, 0, props.initCameraDistance);
      camera.rotation.set(0, 0, 0);
      if (type === 'zero') {
        // 故障展开
        pointEarth.zeroExpand();
      } else {
        // 展开地球
        pointEarth.expand();
      }
    })
    .start();
}

function render() {

  const delta = clock.getDelta();
  pointEarth.update(delta);

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  
  renderer.render( scene, camera );
}

const animate = () => {
  requestAnimationFrame( animate );

  TWEEN.update();
  stats.update();

  render();
};

Init();

const params = new URLSearchParams(window.location.search);
const expandType: string = params.get('expandType') || 'zero';
userInit(expandType);
render();
animate();
