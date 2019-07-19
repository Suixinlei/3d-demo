const THREE = require('three');
const Stats = require('stats.js');
const TWEEN = require('tween');
const dat = require('dat.gui');

const pointEarth = require('./scene/pointEarth/index');
const pointEarthBorder = require('./scene/pointEarthBorder');
const Label = require('./scene/label/index');

const props = require('./props');
const regionData = require('./region');

const {
  toScreenPosition,
} = require('./utils');

require('./index.css');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );
camera.position.z = props.initCameraDistance;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ alpha: false });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// clock
const clock = new THREE.Clock();

let mesh;
let hiddenTube;
var params = {
  extrusionSegments: 100,
  radiusSegments: 3,
  closed: true,
  scale: 1.4,
};

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
const earthGeometry = new THREE.SphereGeometry(props.globeRadius, 64, 64);
const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: false });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
// scene.add(earth);

pointEarth.Init(scene);
pointEarthBorder.Init(scene);

const regions = [];
regionData.forEach((dataItem) => {
  regions.push(
    new Label(dataItem, scene),
  );
});

// 点轮播动画
function rotateAnimation(region) {
  const vec = region.instance.position;
  const oldCameraPosition = camera.position.clone();
  const tween = new TWEEN.Tween({ x: 0 }).to({ x: 1 }, 3000);
  tween.easing(TWEEN.Easing.Sinusoidal.InOut);
  tween.onUpdate(function() {
    const cameraPosition = oldCameraPosition.clone().lerp(vec, this.x).setLength(props.initCameraDistance);
    camera.position.x = cameraPosition.x;
    camera.position.y = cameraPosition.y;
    camera.position.z = cameraPosition.z;
  });
  tween.onComplete(() => {
    const region2DPosition = toScreenPosition(region.instance, renderer, camera);
    region.addAnimation(region2DPosition);
  });
  tween.start();
}

// debug 获取路径点
document.addEventListener('keypress', function (e) {
  var key = e.which || e.keyCode;
  if (key === 13) { // 13 is enter
    const vec = camera.position.clone().setLength(props.globeRadius + 50);
    console.log(`${vec.x}, ${vec.y}, ${vec.z}`);
  }
});

// 画出路径点
const targets = [
  [145.11517656437616, 312.53794982329237, 443.9657818469156],
  [362.7443892979968, 427.3749674465504, -40.139073642565165],
  [201.12393679278406, 354.1698607973945, -387.24265228888],
  [-136.79215962812052, 381.62244006506427, -389.2251511696814],
  [-374.7185859304453, 394.9454252641443, 139.45641764082316],
  [-159.54660726344815, 251.17992611564674, 476.75730180801776],
];

const LineGroup = [];

var material = new THREE.MeshLambertMaterial( { color: 0xff00ff } );
var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.3, wireframe: true, transparent: true } );
function addGeometry( geometry ) {
  // 3D shape
  const mesh = new THREE.Mesh( geometry, material );
  var wireframe = new THREE.Mesh( geometry, wireframeMaterial );
  mesh.add( wireframe );
  scene.add( mesh );
}
function setArc3D(pointStart, pointEnd, smoothness, color, clockWise) {
  // calculate a normal ( taken from Geometry().computeFaceNormals() )
  var cb = new THREE.Vector3(), ab = new THREE.Vector3(), normal = new THREE.Vector3();
  cb.subVectors(new THREE.Vector3(), pointEnd);
  ab.subVectors(pointStart, pointEnd);
  cb.cross(ab);
  normal.copy(cb).normalize();


  var angle = pointStart.angleTo(pointEnd); // get the angle between vectors
  if (clockWise) angle = angle - Math.PI * 2;  // if clockWise is true, then we'll go the longest path
  var angleDelta = angle / (smoothness - 1); // increment

  const vertices = [];
  for (var i = 0; i < smoothness - 1; i++) {
    vertices.push(pointStart.clone().applyAxisAngle(normal, angleDelta * i))  // this is the key operation
  }

  // console.log(pointStart, pointEnd, vertices);
  return vertices;
}

for (let i = 0; i < targets.length; i++) {
  console.log(i);
  const firstVec = new THREE.Vector3(...targets[i]);
  let secondVec;
  if (i === targets.length - 1) {
    secondVec = new THREE.Vector3(...targets[0]);
  } else {
    secondVec = new THREE.Vector3(...targets[i + 1]);
  }
  const lineVertices = setArc3D(firstVec, secondVec, 50, 0xff0000, false);
  LineGroup.push(...lineVertices);

  const lastPoint = lineVertices[lineVertices.length - 4];

}

const lineSpline = new THREE.CatmullRomCurve3(LineGroup);


hiddenTube = new THREE.TubeBufferGeometry( lineSpline, params.extrusionSegments, 2, params.radiusSegments, params.closed );
addGeometry(hiddenTube);

var gui = new dat.GUI( { width: 300 } );
var folderGeometry = gui.addFolder( 'Geometry' );

folderGeometry.add( params, 'scale', 2, 10 ).step( 2 ).onChange( function () {
  setScale();
} );
folderGeometry.add( params, 'extrusionSegments', 50, 500 ).step( 50 ).onChange( function () {
  addTube();
} );
folderGeometry.add( params, 'radiusSegments', 2, 12 ).step( 1 ).onChange( function () {
  addTube();
} );
folderGeometry.add( params, 'closed' ).onChange( function () {
  addTube();
} );
folderGeometry.open();

function render() {
  if (regions && Array.isArray(regions)) {
    regions.forEach((region) => {
      region.render(camera, renderer);
    });
  }

  const delta = clock.getDelta();
  pointEarth.update(delta);

  var time = Date.now();
  var looptime = 20 * 1000;
  var t = (time % looptime) / looptime;
  var pos = hiddenTube.parameters.path.getPointAt( t );
  pos.multiplyScalar(params.scale);

  camera.position.copy( pos );

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  renderer.render( scene, camera );
}

const animate = () => {
  requestAnimationFrame( animate );

  TWEEN.update();
  stats.update();

  render();
};

render();
animate();
