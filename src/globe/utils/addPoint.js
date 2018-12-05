import * as BABYLON from 'babylonjs';
import uuid from 'uuid/v1';

import convertLngLat from './convertLngLat';
import * as geoData from './geo';

module.exports = (name, scene, manager) => {
  const uuidNow = uuid();
  const vector = convertLngLat(geoData[name], 128);
  const vector3LookAt = convertLngLat(geoData[name], 150);
  const mesh = BABYLON.Mesh.CreateSphere(name, 16, 2, scene);
  mesh.material = new BABYLON.StandardMaterial(name, scene);
  mesh.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
  mesh.lookAt(vector3LookAt);

  const point = new BABYLON.GUI.MeshButton3D(mesh, `click ${name}`);
  manager.addControl(point);
  point.position = vector;

  point.onPointerEnterObservable.add(() => {
    mesh.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
  });
  point.onPointerOutObservable.add(() => {
    mesh.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
  });
  point.onPointerUpObservable.add(() => {
    window.location.href = `/idc?name=${name}`;
  });

  return point;
};
