import * as BABYLON from 'babylonjs';
import arcAnimation from './arcAnimation';

export default function addPoint(worldPosition, scene, camera, ghostCamera, clickCallback) {
  const mesh = BABYLON.Mesh.CreateSphere(name, 16, 2, scene);
  mesh.position = worldPosition;

  const meshMat = new BABYLON.StandardMaterial(name, scene);
  meshMat.diffuseColor = new BABYLON.Color3(1, 1, 0);
  mesh.material = meshMat;

  mesh.actionManager = new BABYLON.ActionManager(scene);
  // 移出
  mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, meshMat, "emissiveColor", meshMat.emissiveColor));
  mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
  // 移入
  mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, meshMat, "emissiveColor", BABYLON.Color3.White()));
  mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "scaling", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));

  mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, () => {
    arcAnimation(scene, camera, ghostCamera, mesh.position);
    clickCallback(worldPosition);
    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnDoublePickTrigger, () => {
      window.location.href = `/idc?name=张北`;
    }));
  }));
}
