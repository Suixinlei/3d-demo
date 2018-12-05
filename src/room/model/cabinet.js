import * as BABYLON from 'babylonjs';
import uuid from 'uuid/v1';

function createCabinet(scene) {
  const id = uuid();
  const cabinetBox = BABYLON.MeshBuilder.CreateBox(id, {
    height: 50,
    width: 10,
    depth: 10,
  }, scene);
  const cabinetMat = new BABYLON.StandardMaterial(id, scene);
  cabinetMat.emssiveColor = new BABYLON.Color3(0, 0, 0);
  cabinetMat.diffuseTexture = new BABYLON.Texture('/public/textures/front.png');
  cabinetBox.material = cabinetMat;

  return cabinetBox;
}

export default createCabinet;
