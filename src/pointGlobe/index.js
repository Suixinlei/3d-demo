const THREE = require('three');
const Stats = require('stats.js');
const TWEEN = require('tween');
const pointVertexShader = require('./glsl/points/vertexShader.glsl');
const pointFragmentShader = require('./glsl/points/fragmentShader.glsl');

const globePoints = require('./map2-pixel.json');
const { 
  convertLngLat,
  toScreenPosition,
  returnSphericalCoordinates
} = require('./utils');
const props = require('./props');

require('./index.css');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );
camera.position.z = props.initCameraDistance;
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(camera);
scene.add(cameraHelper);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// 鼠标
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

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
controls.maxPolarAngle = Math.PI / 3;
controls.minPolarAngle = Math.PI / 3;

controls.update();

// stats
const stats = new Stats();
document.body.appendChild( stats.dom );

// earth
const earthGeometry = new THREE.SphereGeometry(props.innerGlobeRadius, 64, 64);
const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x0c0000, envMap: scene.background, opacity: 0.80 });
earthMaterial.transparent = false;
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const vertices = [];
// points
globePoints.forEach((point) => {
  const vector = returnSphericalCoordinates(point.x, point.y);
  vertices.push(vector);
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
  sizes[ i ] = 5;
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

const tween = new TWEEN.Tween({ x: 0 }).to({ x: 2 }, 3000);
tween.easing(TWEEN.Easing.Sinusoidal.InOut);

let count = geometry.getAttribute('position').count;
tween.onUpdate(function () {
  let x = this.x;
  if (x > 1) {
    x = 2 - x;
  }
  const vertexs = new Float32Array( vertices.length * 3 )
  const positionArray = geometry.getAttribute('position').array;
  for (let i = 0; i < count; i++ ) {
    const target = vertices[i].clone().lerp(spreadVertices[i], x);
    target.toArray(vertexs, i * 3);
  }
  spherePoints.geometry.attributes.position.array = vertexs;
  spherePoints.geometry.attributes.position.needsUpdate = true;
})

tween.delay(2000);
// tween.start();

// 增加北京点
var beijingGeometry = new THREE.SphereGeometry( 2, 8, 8 );
var beijingMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var beijing = new THREE.Mesh( beijingGeometry, beijingMaterial );
const beijingPosition = convertLngLat(39.9042, 116.4074);
beijing.position.x = beijingPosition.x;
beijing.position.y = beijingPosition.y;
beijing.position.z = beijingPosition.z;
scene.add( beijing );

const div = document.createElement('div');
div.innerHTML = '233';
document.body.appendChild(div);
div.style.color = '#00ffff';
div.style.position = 'absolute';

function render() {
  if (beijing) {
    if (camera.position.distanceTo(beijing.position) < 700) {
      const absolutePosition = toScreenPosition(beijing, renderer, camera);
      if (absolutePosition.y > 0 && absolutePosition.x > 0) {
        div.style.left = absolutePosition.x + 'px';
        div.style.top = absolutePosition.y + 'px';
        div.style.display = 'block';
      } else {
        div.style.display = 'none';
      }
    } else {
      div.style.display = 'none';
    }

    raycaster.setFromCamera( mouse, camera );
    const waitingRotate = [
      beijing,
    ];
    var intersects = raycaster.intersectObjects(waitingRotate);
    if (intersects.length > 0) {
      intersects[0].object.material.color.set(0xff0000);
    } else {
      for (let i = 0; i < waitingRotate.length; i++ ) {
        waitingRotate[ i ].material.color.set( 0xffff00 );
      }
    }
  }

  renderer.render( scene, camera );
}

var animate = function () {
  requestAnimationFrame( animate );
  // spherePoints.rotation.y += 0.01;

  TWEEN.update();
  stats.update();

  render();
};

render();
animate();
