const THREE = require('three');
const Stats = require('stats.js');
const TWEEN = require('tween');
const pointVertexShader = require('./glsl/points/vertexShader.glsl');
const pointFragmentShader = require('./glsl/points/fragmentShader.glsl');

const globePoints = require('./pointsGeo.json');
const { returnSphericalCoordinates, returnSphericalCoordinates2 } = require('./utils');
const props = require('./props');

require('./index.css');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = props.initCameraDistance;
scene.add(camera);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
scene.add( ambient );

var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render );
controls.minDistance = 500;
controls.maxDistance = 1000;
controls.enablePan = false;

controls.update();

// stats
const stats = new Stats();
document.body.appendChild( stats.dom );

// earth
const earthGeometry = new THREE.SphereGeometry(props.innerGlobeRadius, 64, 64);
const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, envMap: scene.background });
earthMaterial.transparent = false;
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const vertices = [];
const spreadVertices = [];
// points
globePoints.forEach((point) => {
  const vector = returnSphericalCoordinates(point.x, point.y);
  const vector2 = returnSphericalCoordinates2(point.x, point.y);
  vertices.push(vector);
  spreadVertices.push(vector2);
});

const verticesLength = vertices.length;

const positions = new Float32Array( vertices.length * 3 );
const spreadPositions = new Float32Array( spreadVertices.length * 3 );
var colors = [];
var sizes = new Float32Array( vertices.length );

let vertex;
let vertex2;
var color = new THREE.Color();
for ( var i = 0, l = verticesLength; i < l; i ++ ) {
  vertex = vertices[ i ];
  vertex.toArray( positions, i * 3 );

  vertex2 = spreadVertices[ i ];
  vertex2.toArray( spreadPositions, i * 3 );

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

const startPoint = new THREE.Vector3(props.globeRadius, 0, 0);
const tween = new TWEEN.Tween({ x: 0 }).to({ x: 2 }, 3000);
tween.easing(TWEEN.Easing.Sinusoidal.InOut);

let count = geometry.getAttribute('position').count;
tween.onUpdate(function () {
  let x = this.x;
  if (x > 1) {
    x = 2 - x;
  }
  console.log(x);
  const vertexs = new Float32Array( vertices.length * 3 )
  const positionArray = geometry.getAttribute('position').array;
  for (let i = 0; i < count; i++ ) {
    
    const target = vertices[i].clone().lerp(spreadVertices[i], x);
    target.toArray(vertexs, i * 3);
    if (i == 0) {
      // console.log(target);
      console.log(target.distanceTo(new THREE.Vector3(0, 0, 0)));
    }
  }
  spherePoints.geometry.attributes.position.array = vertexs;
  spherePoints.geometry.attributes.position.needsUpdate = true;
})

tween.delay(2000);
tween.start();

function render() {
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
