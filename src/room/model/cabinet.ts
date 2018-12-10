import * as BABYLON from 'babylonjs';

let center: string = null;
let labelCurrent: BABYLON.Mesh = null;

function createCabinet(scene, name, index, camera): BABYLON.Mesh {
  const cabinetBox = BABYLON.MeshBuilder.CreateBox(name, {
    height: 101,
    width: 10,
    depth: 10,
  }, scene);
  cabinetBox.position = new BABYLON.Vector3(300 - Math.floor(index / 20) * 30, 50, 90 - (index % 15) * 10);

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
          labelCurrent.dispose();
      }
      center = cabinetBox.id;
      cabinetMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
      labelCurrent = createCabinetLabel(scene, name, cabinetBox.position);
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

function createCabinetLabel(scene, name, position) {
  const labelWidth = 40;
  const labelHeight = 10;
  const label = BABYLON.MeshBuilder.CreatePlane(name, { width: labelWidth, height: labelHeight, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
  label.position = position.add(new BABYLON.Vector3(0, 80, 0));

  const labelTexture = new BABYLON.DynamicTexture('dynamic', { width: labelWidth * 6, height: labelHeight * 6 }, scene, false);
  const labelMat = new BABYLON.StandardMaterial(name, scene);
  labelMat.diffuseTexture = labelTexture;
  label.material = labelMat;


  const fontSize = 12;
  const ctx = labelTexture.getContext();
  ctx.font = `${fontSize}px monospace`;
  const textWidth = ctx.measureText(name).width;
  const ratio = textWidth / fontSize;
  const fontRealSize = Math.floor(labelWidth * 6 / ratio);
  labelTexture.drawText(name, null, null, `${fontRealSize}px monospace`, 'white', 'black', true, true);

  return label;
}

export default createCabinet;
