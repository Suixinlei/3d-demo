const THREE = require('three');
const pointVertexShader = require('./glsl/points/vertexShader.glsl');
const pointFragmentShader = require('./glsl/points/fragmentShader.glsl');

const globePoints = require('./globePoints');
const { returnSphericalCoordinates } = require('./utils');

require('./index.css');

const radius = 256;
const segments = 64;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 400;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
scene.add( ambient );

var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render );
controls.minDistance = 20;
controls.maxDistance = 500;
controls.enablePan = false;

controls.update();

const vertices = [];

// points
globePoints.points.forEach((point) => {
  const vector = returnSphericalCoordinates(point.x, point.y);
  vertices.push(vector);
  // console.log(vector);
});


const length1 = vertices.length;

var positions = new Float32Array( vertices.length * 3 );
var colors = new Float32Array( vertices.length * 3 );
var sizes = new Float32Array( vertices.length );
var vertex;
var color = new THREE.Color();
for ( var i = 0, l = vertices.length; i < l; i ++ ) {
  vertex = vertices[ i ];
  vertex.toArray( positions, i * 3 );
  color.setHSL( 0.01 + 0.1 * ( i / length1 ), 0.99, ( vertex.y + radius ) / ( 4 * radius ) );
  color.toArray( colors, i * 3 );
  sizes[ i ] = 10;
}
var geometry = new THREE.BufferGeometry();
geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
geometry.addAttribute( 'ca', new THREE.BufferAttribute( colors, 3 ) );


const pointMaterial = new THREE.ShaderMaterial( {
  uniforms: {
    color: { value: new THREE.Color( 0xffffff ) },
    texture: { value: new THREE.TextureLoader().load( "/images/spark1.png" ) }
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

function render() {


  renderer.render( scene, camera );

}

var animate = function () {
  requestAnimationFrame( animate );

  // spherePoints.rotation.y += 0.01;

  render();
};

render();
animate();
