const THREE = require('three');
const props = require('./props');

function convertLngLat(dot) {
  var lat = dot.y;
  var lng = dot.x;
  var phi = (90 - lat) * Math.PI / 180;
  var theta = (180 - lng) * Math.PI / 180;
  var x = props.globeRadius * Math.sin(phi) * Math.cos(theta);
  var y = props.globeRadius * Math.cos(phi);
  var z = props.globeRadius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, -z);
}

function returnSphericalCoordinates(latitude, longitude) {
  // Convert latitude and longitude on the 90/180 degree axis
  latitude = ((latitude - props.mapSize.width) / props.mapSize.width) * 180;
  longitude = ((longitude - props.mapSize.height) / props.mapSize.height) * -90;

  // Calculate the projected starting point
  var radius = Math.cos(longitude / 180 * Math.PI) * props.globeRadius;
  var targetX = Math.cos(latitude / 180 * Math.PI) * radius;
  var targetY = Math.sin(longitude / 180 * Math.PI) * props.globeRadius;
  var targetZ = Math.sin(latitude / 180 * Math.PI) * radius;

  return new THREE.Vector3(-targetX, targetY, targetZ);
}

function returnSphericalCoordinates2(latitude, longitude) {
  const targetRadius = props.globeRadius * 1.2;

  // Convert latitude and longitude on the 90/180 degree axis
  latitude = ((latitude - props.mapSize.width) / props.mapSize.width) * 180;
  longitude = ((longitude - props.mapSize.height) / props.mapSize.height) * -90;

  // Calculate the projected starting point
  var radius = Math.cos(longitude / 180 * Math.PI) * targetRadius;
  var targetX = Math.cos(latitude / 180 * Math.PI) * radius;
  var targetY = Math.sin(longitude / 180 * Math.PI) * targetRadius;
  var targetZ = Math.sin(latitude / 180 * Math.PI) * radius;

  return new THREE.Vector3(-targetX, targetY, targetZ);
}

function toScreenPosition(obj, renderer, cameraInstance) {
    var vector = new THREE.Vector3();

    var widthHalf = 0.5 * renderer.context.canvas.width;
    var heightHalf = 0.5 * renderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(cameraInstance);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
        x: vector.x,
        y: vector.y
    };
};

module.exports = {
  convertLngLat,
  toScreenPosition,
  returnSphericalCoordinates,
  returnSphericalCoordinates2
};
