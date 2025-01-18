import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';

const container = document.createElement( 'div' );
let stats;
var camera, scene, raycaster, renderer;
var mouse = new THREE.Vector2(), INTERSECTED;
let theta = 0;
var frustumSize = 1000;

const width = window.innerWidth;
const height = window.innerHeight;

init();
animate();
function init() {
  document.body.appendChild( container );

  var aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
  camera.position.y = -10;

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xf0f0f0 );
  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( -100, 100, 200 ).normalize();
  const helper = new THREE.DirectionalLightHelper(light, 10);
  scene.add(helper);
  scene.add(light);

  // axisHelper
  var axesHelper = new THREE.AxesHelper( 1000 );
  scene.add( axesHelper );

  raycaster = new THREE.Raycaster();
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  stats = new Stats();
  container.appendChild( stats.dom );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  //
  window.addEventListener( 'resize', onWindowResize, false );


  var controls = new OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );
  controls.minDistance = 1;
  controls.maxDistance = 200;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.1;
  controls.enablePan = false;
  controls.update();


  const circleMaterial = new THREE.MeshPhongMaterial({ color: 0x2d85ff });
  const circleLineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );


  function circleLine(radius, segements, z) {
    const Group = new THREE.Group();
    const circleGeometry = new THREE.CircleGeometry(radius, segements);
    circleGeometry.vertices.shift();

    // Non closed circle with one open segment:
    // scene.add( new THREE.Line( geometry, material ) );

    // To get a closed circle use LineLoop instead (see also @jackrugile his comment):
    const lineLoop = new THREE.LineLoop( circleGeometry, circleLineMaterial );
    // Group.add(lineLoop);

    // 增加小球
    circleGeometry.vertices.forEach((item) => {
      var geometry = new THREE.SphereGeometry( 5, 32, 32 );
      var sphere = new THREE.Mesh( geometry, circleMaterial );
      sphere.position.copy(item);
      sphere.position.z = z;
      scene.add( sphere );
    });
    scene.add(Group);
  }

  circleLine(100, 8, 50);
  circleLine(150, 32, 25);
  circleLine(200, 64, 0);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
//
function animate() {
  requestAnimationFrame( animate );
  render();
  stats.update();
}
function render() {
  theta += 0.1;
  camera.lookAt( scene.position );
  camera.updateMatrixWorld();
  // find intersections
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( scene.children );
  if ( intersects.length > 0 ) {
    if (INTERSECTED != intersects[ 0 ].object) {
      // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      INTERSECTED = intersects[ 0 ].object;
      console.log(INTERSECTED);
      // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      // INTERSECTED.material.emissive.setHex(0xff0000);
    }
  } else {
    // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
    INTERSECTED = null;
  }
  renderer.render( scene, camera );
}
