const THREE = require('three');
const pointVertexShader = require('./glsl/points/vertexShader.glsl');
const pointFragmentShader = require('./glsl/points/fragmentShader.glsl');

const globePoints = require('./pointsGeo.json');
const { returnSphericalCoordinates } = require('./utils');
const props = require('./props');

require('./index.css');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
scene.add( ambient );

var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render );
controls.minDistance = 20;
controls.maxDistance = 500;
controls.enablePan = false;

controls.update();

const vertices = [];

// earth
const earthGeometry = new THREE.SphereGeometry(props.innerGlobeRadius, 64, 64);
const earthMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: scene.background });
earthMaterial.transparent = false;
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);


// points
globePoints.forEach((point) => {
  const vector = returnSphericalCoordinates(point.x, point.y);
  vertices.push(vector);
});


const verticesLength = vertices.length;

const positions = new Float32Array( vertices.length * 3 );
var colors = [];
var sizes = new Float32Array( vertices.length );

var vertex;
var color = new THREE.Color();
for ( var i = 0, l = verticesLength; i < l; i ++ ) {
  vertex = vertices[ i ];
  vertex.toArray( positions, i * 3 );

  color.setHex(0x00ffff);
  colors.push(colors);
  color.toArray( colors, i * 3 );
  sizes[ i ] = 5;
}
var geometry = new THREE.BufferGeometry();
geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );


const pointMaterial = new THREE.ShaderMaterial( {
  uniforms: {
    color: { value: new THREE.Color( 0xffffff ) },
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


const innerPointGeometry = new THREE.BufferGeometry().copy(geometry);
innerPointGeometry.scale(0.95, 0.95, 0.95);
const innerPointMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color: { value: new THREE.Color( 0xffffff ) },
    // texture: { value: new THREE.TextureLoader().load( "/images/particle.png" ) }
  },
  vertexShader: pointVertexShader,
  fragmentShader: pointFragmentShader,
  transparent: true,
  vertexColors: true,
  depthTest: false,
  blending: THREE.AdditiveBlending,
});
const innerSpherePoints = new THREE.Points(innerPointGeometry, new THREE.MeshBasicMaterial({ color: 0xfff000}));
// scene.add(innerSpherePoints);

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
