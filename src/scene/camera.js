import * as BABYLON from 'babylonjs';

module.exports = function (scene) {
  var camera = new BABYLON.ArcRotateCamera("Camera", - Math.PI / 2, Math.PI / 2, 30, BABYLON.Vector3.Zero(), scene);
  camera.setPosition(new BABYLON.Vector3(0, 20, 30));
  camera.useBouncingBehavior = true;

  return camera;
}
