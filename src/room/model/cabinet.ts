import * as BABYLON from 'babylonjs';

let center: string = null;

function createCabinet(scene, name, index): BABYLON.Mesh {
  const cabinetBox = BABYLON.MeshBuilder.CreateBox(name, {
    height: 101,
    width: 10,
    depth: 10,
  }, scene);
  cabinetBox.position = new BABYLON.Vector3(300 - Math.floor(index / 20) * 30, 50, 90 - (index % 20) * 10);

  const cabinetMat = new BABYLON.StandardMaterial(name, scene);
  cabinetMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
  cabinetMat.diffuseTexture = new BABYLON.Texture('/public/textures/front.png', scene);
  cabinetBox.material = cabinetMat;

  cabinetBox.actionManager = new BABYLON.ActionManager(scene);
  cabinetBox.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, cabinetMat, 'emissiveColor', new BABYLON.Color3(0, 0, 0)));
  cabinetBox.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, cabinetMat, 'emissiveColor', BABYLON.Color3.White()));
  cabinetBox.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
    if (center !== cabinetBox.id) {
      if (center) {
          const cabinetOld = scene.getMeshByID(center);
          cabinetOld.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
      }
      center = cabinetBox.id;
      cabinetBox.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
      window.changeDisplay(name);
    } else {
      center = null;
      cabinetBox.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
      window.closeDisplay();
    }
  }));

  return cabinetBox;
}

export default createCabinet;
