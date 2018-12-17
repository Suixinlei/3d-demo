function createLabel(scene, name, position, clickCallback) {
  const labelWidth = 40;
  const labelHeight = 10;
  const label = BABYLON.MeshBuilder.CreatePlane(name, { width: labelWidth, height: labelHeight, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
  label.position = position.clone();

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
  labelTexture.drawText(name, null, null, `${fontRealSize}px monospace`, 'black', 'transparent', true, true);
  label.renderOutline = true;
  label.outlineWidth = 0.1;
  labelTexture.hasAlpha = true;

  // MouseOver
  var makeOverOut = function (mesh) {
    mesh.actionManager = new BABYLON.ActionManager(scene);
    mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh.material, "diffuseColor", mesh.material.emissiveColor));
    mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "diffuseColor", BABYLON.Color3.White()));
    mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
    mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "scaling", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));
    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
      trigger: BABYLON.ActionManager.OnPickDownTrigger,
      // parameter: 'r',
    }, clickCallback));
  };
  makeOverOut(label);

  return label;
}

export default createLabel;
