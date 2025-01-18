const THREE = require('three');
const Stats = require('stats.js');
const TWEEN = require('tween');

const props = require('./props');
const pointEarth = require('./pointEarth/index');
const {
  returnSphericalCoordinates,
} = require('./utils');

let scene;
let camera;
let renderer;
let stats;

let clock;

let cube;

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
  controls.minDistance = 10;
  controls.maxDistance = 1000;
  controls.enablePan = false;

  controls.update();


  // axisHelper
  var axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );
}

function addSphere(vec) {
  var cubegeometry = new THREE.SphereGeometry( 5, 32, 32 );
  var cubematerial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  cube = new THREE.Mesh( cubegeometry, cubematerial );
  cube.position.x = vec.x;
  cube.position.y = vec.y;
  cube.position.z = 0;
  scene.add( cube );
}

function userInit() {
  pointEarth.Init(scene);

  var cubegeometry = new THREE.SphereGeometry( 5, 32, 32 );
  var cubematerial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  cube = new THREE.Mesh( cubegeometry, cubematerial );
  scene.add( cube );

  // 画出路径点
  const targets = [
    new THREE.Vector2(0, 58),
    new THREE.Vector2(30, 58),
    new THREE.Vector2(72, 60),
    new THREE.Vector2(129, 60),
    new THREE.Vector2(228, 68),
    new THREE.Vector2(285, 90),
    new THREE.Vector2(335, 88),

    new THREE.Vector2(369, 75),
    new THREE.Vector2(400, 58),
    new THREE.Vector2(448, 58),
  ];

  targets.map((item) => {
    item.y = props.mapSize.height * 2 - item.y;
    return item;
  });

  targets.forEach((item) => {
    addSphere(item);
  });

  const curve = new THREE.SplineCurve(targets);
  var points = curve.getPoints( 50 );
  var geometry = new THREE.BufferGeometry().setFromPoints( points );

  var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

  // Create the final object to add to the scene
  var splineObject = new THREE.Line( geometry, material );
  scene.add(splineObject);

  const targetsVecs = curve.getPoints(400);
  const rs = [];
  targetsVecs.forEach((item) => {
    let res = returnSphericalCoordinates(item.x, item.y).setLength(props.globeRadius + 50);
    rs.push([res.x, res.y, res.z]);
  });
  console.log(JSON.stringify(rs));
}

var xSpeed = 10;
var ySpeed = 10;

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (keyCode == 87) {
    cube.position.y += ySpeed;
  } else if (keyCode == 83) {
    cube.position.y -= ySpeed;
  } else if (keyCode == 65) {
    cube.position.x -= xSpeed;
  } else if (keyCode == 68) {
    cube.position.x += xSpeed;
  } else if (keyCode == 32) {
    cube.position.set(0, 0, 0);
  }

  if (keyCode === 13) { // 13 is enter
    const vec = cube.position.clone();
    console.log(`new THREE.Vector2(${vec.x}, ${props.mapSize.height * 2 - vec.y}),`);
  }
};


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
