import * as BABYLON from 'babylonjs';
import createLabel from '../utils/createLabel';

let center: string = null;
let labelCurrent: BABYLON.Mesh = null;

function createCabinet(scene, name, position, camera): BABYLON.Mesh {
  const cabinetBox = BABYLON.MeshBuilder.CreateBox(name, {
    height: 101,
    width: 30,
    depth: 30,
  }, scene);
  cabinetBox.position = position;
  cabinetBox.enableEdgesRendering();
  cabinetBox.edgesWidth = 100.0;
  cabinetBox.edgesColor = new BABYLON.Color4(0, 0, 0, 1);

  const cabinetMat = new BABYLON.StandardMaterial(name, scene);
  cabinetMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
  cabinetBox.material = cabinetMat;

  cabinetBox.actionManager = new BABYLON.ActionManager(scene);
  cabinetBox.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, cabinetMat, 'emissiveColor', new BABYLON.Color3(0, 0, 0)));
  cabinetBox.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, cabinetMat, 'emissiveColor', BABYLON.Color3.White()));
  cabinetBox.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
    if (center !== cabinetBox.id) {
      if (center) {
          const cabinetOld = scene.getMeshByID(center);
          cabinetOld.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
          labelCurrent.dispose();
      }
      center = cabinetBox.id;
      cabinetMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
      labelCurrent = createLabel(scene, name, cabinetBox.position.clone().add(new BABYLON.Vector3(0, 100, 0)), () => {});
      scene.registerAfterRender(() => {
        if (labelCurrent) {
          labelCurrent.lookAt(camera.position);
        }
      });
      (<any>window).changeDisplay(name);
    } else {
      center = null;
      cabinetMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
      labelCurrent.dispose();
      (<any>window).closeDisplay();
    }
  }));

  return cabinetBox;
}

export default createCabinet;
