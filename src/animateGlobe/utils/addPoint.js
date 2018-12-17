import * as BABYLON from 'babylonjs';
import arcAnimation from './arcAnimation';
import createLabel from './createLabel';

export default function addPoint(worldPosition, name, scene, camera, ghostCamera, clickCallback) {
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

  const label = createLabel(scene, name, worldPosition.clone().scale(1.1), () => {
    arcAnimation(scene, camera, ghostCamera, mesh.position);
    clickCallback(worldPosition);
    console.log('开始计时');
    setInterval(() => {
      window.location.href = `/idc?name=张北`;
    }, 3000);
  });

  scene.registerAfterRender(() => {
    label.lookAt(camera.position);
  })
}
