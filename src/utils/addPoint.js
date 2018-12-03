import * as BABYLON from 'babylonjs';
import uuid from 'uuid/v1';

module.exports = (vector, scene) => {
  const label = BABYLON.MeshBuilder.CreateSphere(uuid(), { segments: 16, diameter: 1}, scene);
  const labelMat = new BABYLON.StandardMaterial(uuid(), scene);
  labelMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
  label.material = labelMat;
  label.position = vector;

  return label;
}
