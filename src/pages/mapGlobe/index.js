const THREE = require('three');
const Stats = require('stats.js');
const TWEEN = require('tween');
const mapboxgl = require('mapboxgl');

require('./index.css');

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaHVhc3VpIiwiYSI6ImNqd2ltd3kzZTJxN2k0NWtkcjI5dTZ4d3UifQ.9qU_lGxNxWBIaSOvt3hO0w';

var zoom = 5;
var mapWidth = 1200 * zoom;
var mapHeight = 1200 * zoom;
var DEBUG = location.hash == '#DEBUG';

var $map = document.getElementById('map');
var $eMap = document.getElementById('equirectangular-map');
var $loader = document.getElementById('loader');

$map.style.width = mapWidth + 'px';
$map.style.height = mapHeight + 'px';

var dpr = window.devicePixelRatio;
var width = mapWidth * dpr;
var height = mapHeight * dpr;
var halfHeight = height / 2;

$eMap.width = width;
$eMap.height = halfHeight;

// 3D stuff
var container = document.getElementById('container');
var renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  stencil: false,
});
renderer.setPixelRatio(dpr);
renderer.setSize(window.innerWidth, window.innerHeight);
// Fix "GL_ARB_gpu_shader5" bug: https://github.com/mrdoob/three.js/issues/9716
renderer.context.getShaderInfoLog = function(){ return '' };
container.appendChild(renderer.domElement);

// Camera
var camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 800;
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render );
controls.minDistance = 500;
controls.maxDistance = 1000;
controls.enablePan = false;
// controls.maxPolarAngle = Math.PI / 3;
// controls.minPolarAngle = Math.PI / 3;

controls.update();

// Scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Earth
var texture = new THREE.CanvasTexture($eMap);
texture.minFilter = THREE.LinearFilter; // Fix "Textures should be of a power of two" warning
var geometry = new THREE.SphereGeometry(512, 64, 64);
var material = new THREE.MeshBasicMaterial();
var earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// Light
var light = new THREE.DirectionalLight(0xffffff);
light.target = earth;
scene.add(light);

if (DEBUG){
  var stats = new Stats();
  container.appendChild(stats.domElement);
}

// Stop auto-rotating earth when dragging it
var stopRotating = false;
container.ontouchstart = container.onmousedown = function(){
  stopRotating = true;
};
container.ontouchend = container.ontouchcancel = container.onmouseup = function(){
  stopRotating = false;
};

window.onresize = function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};



// Projections stuff
var equirectangular = d3.geoEquirectangular()
  .scale(width / 2 / Math.PI)
  .translate([width / 2, height * .75]);
var mercator = d3.geoMercator()
  .scale(width / 2 / Math.PI)
  .translate([width / 2, height / 2]);
var invert = equirectangular.invert;

var context = $eMap.getContext('2d', { alpha: false });

$loader.hidden = false;

var map = new mapboxgl.Map({
  container: 'map',
  // optimize=true -> https://blog.mapbox.com/style-optimized-vector-tiles-39868da81275
  // style: 'mapbox://styles/mapbox/' + style + '-v9?optimize=true',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [0, 0],
  zoom: zoom,
  // interactive: false,
  // renderWorldCopies: false,
  attributionControl: false,
  // trackResize: false,
  preserveDrawingBuffer: true,
});

map.on('load', function() {
  var canvas = map.getCanvas();
  var gl = canvas.getContext('webgl', { alpha: false, antialias: false });

  console.log('Map loaded');

  setTimeout(function() {
    console.log('Render map start');
    var source = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, source);
    var sourceData = new Uint8ClampedArray(source.buffer);
    var targetData = new Uint8ClampedArray(sourceData.length/2).fill(255);

    // This part is really slow >:(
    console.time('Reprojection');
    var w = width;
    var h = height;
    var x = 0;
    var y;
    for (; x < w; x++) {
      for (y = 0; y < h; y++){
        var pixels = mercator(invert([x, y]));
        if (!isNaN(pixels[1])){
          var sourceIndex = 4 * (~~pixels[0] + w * ~~pixels[1]);
          // Would have been x + w + h if it's not WebGL context
          // (h-y-1) is to flip the Y (vertical) because WebGL texture starts at the bottom
          var targetIndex = 4 * (x + w * (h-y-1));
          targetData[targetIndex] = sourceData[sourceIndex];
          targetData[targetIndex + 1] = sourceData[sourceIndex + 1];
          targetData[targetIndex + 2] = sourceData[sourceIndex + 2];
          // targetData[targetIndex + 3] = 255; // Already filled
        }
      }
    }
    console.timeEnd('Reprojection');

    // $eMap.width = $eMap.width;
    var target = context.createImageData(width, halfHeight);
    target.data.set(targetData);

    // Draw the equirectangular projection canvas
    context.clearRect(0, 0, $eMap.width, $eMap.height);
    context.putImageData(target, 0, 0);

    // Cover the North pole
    for (var y = 0; y < halfHeight; y++) {
      var index = y * w * 4;
      var firstColor = targetData[index];
      if (firstColor !== 0){
        var color = 'rgb(' + targetData[index] + ',' + targetData[index+1] + ',' + targetData[index+2] + ')';
        context.fillStyle = color;
        context.fillRect(0, 0, w, y);
        break;
      }
    }

    // Cover the South pole
    for (var y = halfHeight-1; y >= 0; --y) {
      var index = y * w * 4;
      var firstColor = targetData[index];
      if (firstColor !== 0){
        var color = 'rgb(' + targetData[index] + ',' + targetData[index+1] + ',' + targetData[index+2] + ')';
        context.fillStyle = color;
        context.fillRect(0, y+1, w, halfHeight-y);
        break;
      }
    }

    console.log('Render map end');

    $loader.hidden = true;

    // Set texture on first load
    if (!material.map){
      material.map = texture;
      material.needsUpdate = true;
      animate();
    }
    // Update texture
    texture.needsUpdate = true;

    // map.remove();
  }, 350); // Delay for the tiles to render properly
});

// Debugging
if (DEBUG){
  document.body.className = 'DEBUG';
}


const clock = new THREE.Clock();
function render(){
  if (!stopRotating){
    var y = .001;
    earth.rotation.y += y;
  }
  light.position.copy(camera.position);
  renderer.render(scene, camera);
}

function animate(){
  requestAnimationFrame(animate);
  render();
  if (DEBUG) stats.update();
}
