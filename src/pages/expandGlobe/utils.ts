import * as THREE from 'three';
import props from './props';

function convertLngLat(lat: number, lng: number): THREE.Vector3 {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (180 - lng) * Math.PI / 180;
  const x = props.globeRadius * Math.sin(phi) * Math.cos(theta);
  const y = props.globeRadius * Math.cos(phi);
  const z = props.globeRadius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

function returnSphericalCoordinates(latitude: number, longitude: number): THREE.Vector3 {
  // Convert latitude and longitude on the 90/180 degree axis
  let lat = ((latitude - props.mapSize.width) / props.mapSize.width) * 180;
  let long = ((longitude - props.mapSize.height) / props.mapSize.height) * -90;

  // Calculate the projected starting point
  const radius = Math.cos(long / 180 * Math.PI) * props.globeRadius;
  const targetX = Math.cos(lat / 180 * Math.PI) * radius;
  const targetY = Math.sin(long / 180 * Math.PI) * props.globeRadius;
  const targetZ = Math.sin(lat / 180 * Math.PI) * radius;

  return new THREE.Vector3(-targetX, targetY, targetZ);
}

export {
  convertLngLat,
  returnSphericalCoordinates,
};
