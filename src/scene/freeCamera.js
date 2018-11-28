import * as BABYLON from 'babylonjs';

module.exports = function (scene) {
  const camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 5, -15), scene);
  camera.inputs.add(new BABYLON.FreeCameraGamepadInput());
  camera.inputs.attached.gamepad.gamepadAngularSensibility = 250;

  return camera;
}
