import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import globePoints from './globePoints';

/* VARIABLES */

var canvas, scene, renderer;
var data = globePoints;

var globe;

// Cache DOM selectors
var container = document.getElementsByClassName('js-globe')[0];

// Object for country HTML elements and variables
var elements = {};

// Three group objects
var groups = {
  main: null, // A group containing everything
  globe: null, // A group containing the globe sphere (and globe dots)
  globeDots: null, // A group containing the globe dots
  lines: null, // A group containing the lines between each country
  lineDots: null // A group containing the line dots
};

// Map properties for creation and rendering
var props = {
  mapSize: {
    // Size of the map from the intial source image (on which the dots are positioned on)
    width: 2048 / 2,
    height: 1024 / 2
  },
  globeRadius: 200, // Radius of the globe (used for many calculations)
  dotsAmount: 20, // Amount of dots to generate and animate randomly across the lines
  startingCountry: 'hongkong', // The key of the country to rotate the camera to during the introduction animation (and which country to start the cycle at)
  colours: {
    // Cache the colours
    globeDots: 'rgb(61, 137, 164)', // No need to use the Three constructor as this value is used for the HTML canvas drawing 'fillStyle' property
    lines: new THREE.Color('#18FFFF'),
    lineDots: new THREE.Color('#18FFFF')
  },
  alphas: {
    // Transparent values of materials
    globe: 0.4,
    lines: 0.5
  }
};

// Angles used for animating the camera
var camera = {
  object: null, // Three object of the camera
  controls: null, // Three object of the orbital controls
  angles: {
    // Object of the camera angles for animating
    current: {
      azimuthal: null,
      polar: null
    },
    target: {
      azimuthal: null,
      polar: null
    }
  }
};

// Booleans and values for animations
var animations = {
  finishedIntro: false, // Boolean of when the intro animations have finished
  dots: {
    current: 0, // Animation frames of the globe dots introduction animation
    total: 170, // Total frames (duration) of the globe dots introduction animation,
    points: [] // Array to clone the globe dots coordinates to
  },
  globe: {
    current: 0, // Animation frames of the globe introduction animation
    total: 80, // Total frames (duration) of the globe introduction animation,
  },
  countries: {
    active: false, // Boolean if the country elements have been added and made active
    animating: false, // Boolean if the countries are currently being animated
    current: 0, // Animation frames of country elements introduction animation
    total: 120, // Total frames (duration) of the country elements introduction animation
    selected: null, // Three group object of the currently selected country
    index: null, // Index of the country in the data array
    timeout: null, // Timeout object for cycling to the next country
    initialDuration: 5000, // Initial timeout duration before starting the country cycle
    duration: 2000 // Timeout duration between cycling to the next country
  }
};

// Boolean to enable or disable rendering when window is in or out of focus
var isHidden = false;

function showFallback() {

  /*
    This function will display an alert if WebGL is not supported.
  */

  alert('WebGL not supported. Please use a browser that supports WebGL.');

}

function setupScene() {

  canvas = container.getElementsByClassName('js-canvas')[0];

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    shadowMapEnabled: false
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);

  // Main group that contains everything
  groups.main = new THREE.Group();
  groups.main.name = 'Main';

  // Group that contains lines for each country
  groups.lines = new THREE.Group();
  groups.lines.name = 'Lines';
  groups.main.add(groups.lines);

  // Group that contains dynamically created dots
  groups.lineDots = new THREE.Group();
  groups.lineDots.name = 'Dots';
  groups.main.add(groups.lineDots);

  // Add the main group to the scene
  scene.add(groups.main);

  // Render camera and add orbital controls
  addCamera();
  addControls();

  // Render objects
  addGlobeDots();

  // Start the requestAnimationFrame loop
  render();
  animate();

  var canvasResizeBehaviour = function() {

    container.width = window.innerWidth;
    container.height = window.innerHeight;
    container.style.width = window.innerWidth + 'px';
    container.style.height = window.innerHeight + 'px';

    camera.object.aspect = container.offsetWidth / container.offsetHeight;
    camera.object.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);

  };

  window.addEventListener('resize', canvasResizeBehaviour);
  window.addEventListener('orientationchange', function() {
    setTimeout(canvasResizeBehaviour, 0);
  });
  canvasResizeBehaviour();

}



/* CAMERA AND CONTROLS */

function addCamera() {

  camera.object = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 1, 10000);
  camera.object.position.z = props.globeRadius * 2.2;

}

function addControls() {

  camera.controls = new OrbitControls(camera.object, canvas);
  camera.controls.enableKeys = false;
  camera.controls.enablePan = false;
  camera.controls.enableZoom = false;
  camera.controls.enableDamping = false;
  camera.controls.enableRotate = false;

  // Set the initial camera angles to something crazy for the introduction animation
  camera.angles.current.azimuthal = -Math.PI;
  camera.angles.current.polar = 0;

}



/* RENDERING */

function render() {
  renderer.render(scene, camera.object);
}

if ('hidden' in document) {
  document.addEventListener('visibilitychange', onFocusChange);
}
else if ('mozHidden' in document) {
  document.addEventListener('mozvisibilitychange', onFocusChange);
}
else if ('webkitHidden' in document) {
  document.addEventListener('webkitvisibilitychange', onFocusChange);
}
else if ('msHidden' in document) {
  document.addEventListener('msvisibilitychange', onFocusChange);
}
else if ('onfocusin' in document) {
  document.onfocusin = document.onfocusout = onFocusChange;
}
else {
  window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onFocusChange;
}

function onFocusChange(event) {

  var visible = 'visible';
  var hidden = 'hidden';
  var eventMap = {
    focus: visible,
    focusin: visible,
    pageshow: visible,
    blur: hidden,
    focusout: hidden,
    pagehide: hidden
  };

  event = event || window.event;

  if (event.type in eventMap) {
    isHidden = true;
  }
  else {
    isHidden = false;
  }

}

function animate() {

  if (isHidden === false) {
    requestAnimationFrame(animate);
  }

  if (groups.globeDots) {
    introAnimate();
  }

  positionElements();

  camera.controls.update();

  render();

}



/* GLOBE */

function addGlobeDots() {

  groups.globe = new THREE.Group();
  groups.globe.name = 'Globe';
  //
  // groups.globe.add(globe);
  groups.main.add(groups.globe);

  var geometry = new THREE.Geometry();

  // Make circle
  var canvasSize = 16;
  var halfSize = canvasSize / 2;
  var textureCanvas = document.createElement('canvas');
  textureCanvas.width = canvasSize;
  textureCanvas.height = canvasSize;
  var canvasContext = textureCanvas.getContext('2d');
  canvasContext.beginPath();
  canvasContext.arc(halfSize, halfSize, halfSize, 0, 2 * Math.PI);
  canvasContext.fillStyle = props.colours.globeDots;
  canvasContext.fill();

  // Make texture
  var texture = new THREE.Texture(textureCanvas);
  texture.needsUpdate = true;

  var material = new THREE.PointsMaterial({
    // map: texture,
    color: '#000',
    size: props.globeRadius / 120
  });

  var addDot = function(targetX, targetY) {

    // Add a point with zero coordinates
    var point = new THREE.Vector3(0, 0, 0);
    geometry.vertices.push(point);

    // Add the coordinates to a new array for the intro animation
    var result = returnSphericalCoordinates(
      targetX,
      targetY
    );
    animations.dots.points.push(new THREE.Vector3(result.x, result.y, result.z));
  };

  for (var i = 0; i < data.points.length; i++) {
    addDot(data.points[i].x, data.points[i].y);
  }

  for (var country in data.countries) {
    addDot(data.countries[country].x, data.countries[country].y);
  }

  // Add the points to the scene
  groups.globeDots = new THREE.Points(geometry, material);
  groups.globe.add(groups.globeDots);

}

function positionElements() {

  var widthHalf = canvas.clientWidth / 2;
  var heightHalf = canvas.clientHeight / 2;

  // Loop through the elements array and reposition the elements
  for (var key in elements) {

    var targetElement = elements[key];

    var position = getProjectedPosition(widthHalf, heightHalf, targetElement.position);

    // Construct the X and Y position strings
    var positionX = position.x + 'px';
    var positionY = position.y + 'px';

    // Construct the 3D translate string
    var elementStyle = targetElement.element.style;
    elementStyle.webkitTransform = 'translate3D(' + positionX + ', ' + positionY + ', 0)';
    elementStyle.WebkitTransform = 'translate3D(' + positionX + ', ' + positionY + ', 0)'; // Just Safari things (capitalised property name prefix)...
    elementStyle.mozTransform = 'translate3D(' + positionX + ', ' + positionY + ', 0)';
    elementStyle.msTransform = 'translate3D(' + positionX + ', ' + positionY + ', 0)';
    elementStyle.oTransform = 'translate3D(' + positionX + ', ' + positionY + ', 0)';
    elementStyle.transform = 'translate3D(' + positionX + ', ' + positionY + ', 0)';
  }

}



/* INTRO ANIMATIONS */

// Easing reference: https://gist.github.com/gre/1650294

var easeInOutCubic = function(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

function introAnimate() {

  if (animations.dots.current <= animations.dots.total) {

    var points = groups.globeDots.geometry.vertices;
    var totalLength = points.length;

    for (var i = 0; i < totalLength; i++) {

      // Get ease value
      var dotProgress = easeInOutCubic(animations.dots.current / animations.dots.total);

      // Add delay based on loop iteration
      dotProgress = dotProgress + (dotProgress * (i / totalLength));

      if (dotProgress > 1) {
        dotProgress = 1;
      }

      // Move the point
      points[i].x = animations.dots.points[i].x * dotProgress;
      points[i].y = animations.dots.points[i].y * dotProgress;
      points[i].z = animations.dots.points[i].z * dotProgress;

      // Animate the camera at the same rate as the first dot
      if (i === 0) {

        var azimuthalDifference = (camera.angles.current.azimuthal - camera.angles.target.azimuthal) * dotProgress;
        azimuthalDifference = camera.angles.current.azimuthal - azimuthalDifference;
        // camera.controls.setAzimuthalAngle(azimuthalDifference);

        var polarDifference = (camera.angles.current.polar - camera.angles.target.polar) * dotProgress;
        polarDifference = camera.angles.current.polar - polarDifference;
        // camera.controls.setPolarAngle(polarDifference);

      }

    }

    animations.dots.current++;

    // Update verticies
    groups.globeDots.geometry.verticesNeedUpdate = true;

  }

}


/* COORDINATE CALCULATIONS */

// Returns an object of 3D spherical coordinates
function returnSphericalCoordinates(latitude, longitude) {

  /*
    This function will take a latitude and longitude and calcualte the
    projected 3D coordiantes using Mercator projection relative to the
    radius of the globe.

    Reference: https://stackoverflow.com/a/12734509
  */

  // Convert latitude and longitude on the 90/180 degree axis
  latitude = ((latitude - props.mapSize.width) / props.mapSize.width) * -180;
  longitude = ((longitude - props.mapSize.height) / props.mapSize.height) * -90;

  // Calculate the projected starting point
  var radius = Math.cos(longitude / 180 * Math.PI) * props.globeRadius;
  var targetX = Math.cos(latitude / 180 * Math.PI) * radius;
  var targetY = Math.sin(longitude / 180 * Math.PI) * props.globeRadius;
  var targetZ = Math.sin(latitude / 180 * Math.PI) * radius;

  return {
    x: targetX,
    y: targetY,
    z: targetZ
  };

}


// Returns an object of 2D coordinates for projected 3D position
function getProjectedPosition(width, height, position) {

  /*
    Using the coordinates of a country in the 3D space, this function will
    return the 2D coordinates using the camera projection method.
  */

  position = position.clone();
  var projected = position.project(camera.object);

  return {
    x: (projected.x * width) + width,
    y: -(projected.y * height) + height
  };

}


/* INITIALISATION */

if (!window.WebGLRenderingContext) {
  showFallback();
}
else {
  setupScene();
}
