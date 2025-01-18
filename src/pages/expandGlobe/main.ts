// const THREE = require('three');
// const Stats = require('stats.js');
// const TWEEN = require('tween');

import Stats from 'stats.js';

import props from './props';
import pointEarth from './pointEarth/index';

let scene;
let camera;
let renderer;
let stats;

let clock;

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
  var sphereSize = 5;
  var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
  scene.add( pointLightHelper );

  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );
  controls.minDistance = 500;
  controls.maxDistance = 1000;
  controls.enablePan = false;

  controls.update();


  // axisHelper
  var axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );
}

function userInit() {
  pointEarth.Init(scene);
  pointEarth.expand();
  // pointEarth.zeroExpand();
}

function render() {

  const delta = clock.getDelta();
  pointEarth.update(delta);

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  renderer.render( scene, camera );
}

const animate = () => {
  requestAnimationFrame( animate );
  // spherePoints.rotation.y += 0.01;

  TWEEN.update();
  stats.update();

  render();
};

Init();
userInit();
render();
animate();
