import * as THREE from 'three';
import props from '../../scene/props';

export function convertLngLat(lat, lng) {
  var phi = (90 - lat) * Math.PI / 180;
  var theta = (180 - lng) * Math.PI / 180;
  var x = props.globeRadius * Math.sin(phi) * Math.cos(theta);
  var y = props.globeRadius * Math.cos(phi);
  var z = props.globeRadius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

export function returnSphericalCoordinates(latitude, longitude) {
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

export function returnMapBorderSphericalCoordinates(latitude, longitude) {
  // Convert latitude and longitude on the 90/180 degree axis
  latitude = ((latitude - props.mapBorderSize.width) / props.mapBorderSize.width) * 180;
  longitude = ((longitude - props.mapBorderSize.height) / props.mapBorderSize.height) * -90;

  // Calculate the projected starting point
  var radius = Math.cos(longitude / 180 * Math.PI) * (props.globeRadius + 5);
  var targetX = Math.cos(latitude / 180 * Math.PI) * radius;
  var targetY = Math.sin(longitude / 180 * Math.PI) * (props.globeRadius + 5);
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
  for (var i = 0; i < smoothness; i++) {
    vertices.push(pointStart.clone().applyAxisAngle(normal, angleDelta * i))  // this is the key operation
  }

  return vertices;
}
