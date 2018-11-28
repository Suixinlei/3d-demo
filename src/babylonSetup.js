import * as BABYLON from 'babylonjs';

import CabinetScene from './scene/index';
import Camera from './scene/camera';
import freeCamera from './scene/freeCamera';

import worldAxis from './utils/worldAxis';
import cabinet from './model/cabinet';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('renderCanvas');
  const engine = new BABYLON.Engine(canvas, true);

  // call the createScene function
  const scene = CabinetScene(engine);

  // const camera = Camera(scene);
  const camera = freeCamera(scene);
  camera.attachControl(canvas, false);

  // 光
  var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(20, 20, 100), scene);
  const light2 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 0, 0), scene);
  // 光跟着camera走
  scene.registerBeforeRender(function () {
    // light.position = camera.position;
    light2.position = camera.position;
  });

  worldAxis(scene, 512);

  // 创建skybox
  const Skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);


  // const cabinet1 = cabinet(scene);
  // cabinet1.position.x = 10;
  // const cabinet2 = cabinet(scene);
  // cabinet2.position.y = 0;
  // const cabinet3 = cabinet(scene);
  // cabinet3.position.x = -10;

  const assetsManager = new BABYLON.AssetsManager(scene);

  // const floorTask = assetsManager.addMeshTask('floor task', '', 'http://127.0.0.1:9090/', 'floor.obj');
  // floorTask.onSuccess = function (task) {
  //   task.loadedMeshes[0].position.x = -250;
  //   task.loadedMeshes[0].position.y = 0;
  //   task.loadedMeshes[0].position.z = -1050;
  // };
  // floorTask.onError = function (task, message, exception) {
  //   console.log(message, exception);
  // };

  // const floorTask = assetsManager.addMeshTask('floor task', '', 'http://127.0.0.1:9090/sci-fi_corridor/', 'scene.gltf');
  // floorTask.onSuccess = function (task) {
  //   // task.loadedMeshes[0].position.x = -250;
  //   // task.loadedMeshes[0].position.y = 0;
  //   // task.loadedMeshes[0].position.z = -1050;
  // };
  // floorTask.onError = function (task, message, exception) {
  //   console.log(message, exception);
  // };

  const skyBoxTask = assetsManager.addMeshTask('skybox task', '', 'http://127.0.0.1:9090/fantasy_sky_background/', 'scene.gltf');
  skyBoxTask.onSuccess = (task) => {
    console.log(task);
  };
  skyBoxTask.onError = function (task, message, exception) {
    console.log(message, exception);
  };


  assetsManager.onFinish = function (tasks) {
    engine.runRenderLoop(function () {
      scene.render();
    });
  };

  assetsManager.load();

  // the canvas/window resize event handler
  window.addEventListener('resize', function(){
    engine.resize();
  });
});
