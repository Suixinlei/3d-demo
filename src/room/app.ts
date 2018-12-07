import * as BABYLON from 'babylonjs';
import worldAxis from './utils/worldAxis';

import createCabinet from './model/cabinet';

interface cabinet {
  label: string,
  cpu: number,
  origin: BABYLON.Mesh,
  cpuHot: BABYLON.Mesh,
}

class App {
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.ArcRotateCamera;
  private _light: BABYLON.Light;
  private _assetsManager: BABYLON.AssetsManager;

  public cabinetList: Array<cabinet> = new Array<cabinet>(100);

  constructor(canvasElement: string) {
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = new BABYLON.Engine(this._canvas, true);
  }

  createScene(): void {
    this._scene = new BABYLON.Scene(this._engine);

    // camera
    this._camera = new BABYLON.ArcRotateCamera('camera1', 2.2174219301085647, 0.8584378292646299, 425, BABYLON.Vector3.Zero(), this._scene);
    this._camera.lowerBetaLimit = 0.1;
    this._camera.upperBetaLimit = (Math.PI / 2) * 0.9;
    this._camera.lowerRadiusLimit = 60;
    this._camera.upperRadiusLimit = 500;
    this._camera.attachControl(this._canvas, false);

    // light
    this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 100, 0), this._scene);

    worldAxis(this._scene, 512);
  }

  createAssetsManager(): void {
    this._assetsManager = new BABYLON.AssetsManager(this._scene);
    // 机柜任务
    const floorTask = this._assetsManager.addMeshTask('floor', '', `/public/resource/`, 'xb.obj');
    floorTask.onSuccess = (task) => {
      console.log('cabinet', task);
    };
    floorTask.onError = (task, message, exception) => {
      console.log(task, message, exception);
    };


    this._assetsManager.load();
  }

  createCabinets(): void {
    fetch('http://dip.alibaba-inc.com/api/v2/services/schema/mock/93826').then(res => res.json()).then((data) => {
      data.forEach((dataItem, index) => {
        const newCabinet = createCabinet(this._scene, dataItem.label, index);
        this.cabinetList[index] = {
          label: dataItem.label,
          cpu: dataItem.cpu,
          origin: newCabinet,
          cpuHot: null,
        };
      })
    });
  }

  createCpuHotMap = (): void => {
    this.cabinetList.forEach((cabinetItem, index): void => {
      const bar = BABYLON.MeshBuilder.CreateBox(cabinetItem.label, {
        height: 1.0,
        width: 9,
        depth: 9,
      }, this._scene);
      const originPosition = cabinetItem.origin.position;
      bar.position = new BABYLON.Vector3(originPosition.x, 0, originPosition.z);

      this.cabinetList[index].origin.material.alpha = 0.5;
      this.cabinetList[index].cpuHot = bar;

      // animation
      const animation = new BABYLON.Animation('anim', 'scaling', 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3);
      animation.setKeys([
        {frame: 0, value: new BABYLON.Vector3(1, 0, 1)},
        {frame: 100, value: new BABYLON.Vector3(1, cabinetItem.cpu, 1)}
      ]);
      bar.animations.push(animation);

      // animation
      const animationPosition = new BABYLON.Animation("anim2", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
      animationPosition.setKeys([
        {frame: 0, value: 0},
        {frame: 100, value: (cabinetItem.cpu) / 2}]);
      bar.animations.push(animationPosition);
      this._scene.beginAnimation(bar, 0, 100, false, 2.0);

      const barMat = new BABYLON.StandardMaterial(cabinetItem.label + 'mat', this._scene);
      bar.material = barMat;
      barMat.specularColor = new BABYLON.Color3(0, 0, 0);
      if (cabinetItem.cpu <= 100 && cabinetItem.cpu > 70) {
        barMat.diffuseColor = BABYLON.Color3.Red();
      }
      if (cabinetItem.cpu <= 70 && cabinetItem.cpu > 40) {
        barMat.diffuseColor = BABYLON.Color3.Yellow();
      }
      if (cabinetItem.cpu >= 0 && cabinetItem.cpu <= 40) {
        barMat.diffuseColor = BABYLON.Color3.Green();
      }
    });
  };

  closeCpuHotMap = (): void => {
    this.cabinetList.forEach((cabinetItem: cabinet, index): void => {
      cabinetItem.origin.material.alpha = 1.0;
      if (cabinetItem.cpuHot) {
        cabinetItem.cpuHot.dispose();
      }
    });
  };

  doRender(): void {
    this._assetsManager.onFinish = (tasks) => {
      this._engine.runRenderLoop(() => {
        this._scene.render();
      });
    };

    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }
}

export default App;
