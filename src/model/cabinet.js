import * as BABYLON from 'babylonjs';
import uuid from 'uuid/v1';

function createCabinet(scene) {
  const cabinetBox = BABYLON.MeshBuilder.CreateBox(uuid(), {
    height: 5,
    width: 3,
    depth: 3,
  }, scene);

  return cabinetBox;
}

module.exports = createCabinet;
