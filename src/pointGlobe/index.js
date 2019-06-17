const THREE = require('three');
const Stats = require('stats.js');
const TWEEN = require('tween');

const pointEarth = require('./scene/pointEarth/index');
const pointEarthBorder = require('./scene/pointEarthBorder');
const Label = require('./scene/label/index');

const props = require('./props');
const regionData = require('./region');

require('./index.css');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );
camera.position.z = props.initCameraDistance;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ alpha: false });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// 鼠标
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
window.addEventListener('mousemove', onMouseMove, false );

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
// controls.maxPolarAngle = Math.PI / 3;
// controls.minPolarAngle = Math.PI / 3;

controls.update();

// stats
const stats = new Stats();
document.body.appendChild( stats.dom );

// axisHelper
var axesHelper = new THREE.AxesHelper( 1000 );
scene.add( axesHelper );

// 内藏球体
const earthGeometry = new THREE.SphereGeometry(props.innerGlobeRadius, 64, 64);
const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 1 });
earthMaterial.transparent = false;
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

pointEarth.Init(scene);
pointEarthBorder.Init(scene);

const regions = [];
regionData.forEach((dataItem) => {
  regions.push(
    new Label(dataItem, scene),
  );
});


function render() {
  if (regions && Array.isArray(regions)) {
    regions.forEach((region) => {
      region.render(camera, renderer);
    });
  }
  renderer.render( scene, camera );
}

const animate = () => {
  requestAnimationFrame( animate );
  // spherePoints.rotation.y += 0.01;

  TWEEN.update();
  stats.update();

  render();
};

render();
animate();
