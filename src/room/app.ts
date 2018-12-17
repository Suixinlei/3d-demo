import * as BABYLON from 'babylonjs';
import worldAxis from './utils/worldAxis';
import * as queryString from 'queryString';
import createCabinet from './model/cabinet';

const parsedQuery = queryString.parse(location.search);

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
    this._camera = new BABYLON.ArcRotateCamera('camera1', 0.790508975265214, 1.0601229998641686, 800, BABYLON.Vector3.Zero(), this._scene);
    this._camera.lowerBetaLimit = 0.1;
    this._camera.upperBetaLimit = (Math.PI / 2);
    this._camera.lowerRadiusLimit = 500;
    this._camera.upperRadiusLimit = 1000;
    this._camera.attachControl(this._canvas, false);

    // light
    this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 100, 0), this._scene);
    const light2 = new BABYLON.DirectionalLight('direction', new BABYLON.Vector3(-100, -300, -100), this._scene);

    // ground
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 600, height: 600 }, this._scene);
    const groundMat = new BABYLON.StandardMaterial('mat1', this._scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.502, 0.502, 0.502);
    groundMat.diffuseColor = BABYLON.Color3.White();
    groundMat.alpha = 0.8;
    ground.material = groundMat;

    if (process.env.NODE_ENV === 'development') {
      worldAxis(this._scene, 512);
    }
  }

  createCabinets(): void {
    fetch('http://dip.alibaba-inc.com/api/v2/services/schema/mock/93826').then(res => res.json()).then((data) => {
      for (let i = 0; i < 35; i++) {
        if (i < 9) {
          const newCabinet = createCabinet(this._scene, `A-${i+1}`, new BABYLON.Vector3(250, 101 / 2, - 180 + i * 40), this._camera);
          this.cabinetList[i] = {
            label: data[i].label,
            cpu: data[i].cpu,
            origin: newCabinet,
            cpuHot: null,
          };
        } else if (i >= 9 && i < 19) {
          const newCabinet = createCabinet(this._scene, `B-${i-8}`, new BABYLON.Vector3(150, 101 / 2, - 180 + (i - 9) * 40), this._camera);
          this.cabinetList[i] = {
            label: data[i].label,
            cpu: data[i].cpu,
            origin: newCabinet,
            cpuHot: null,
          };
        } else if (i >= 19 && i < 25) {
          const newCabinet = createCabinet(this._scene, `C-${i-18}`, new BABYLON.Vector3(-100, 101 / 2, - 180 + (i - 19) * 40), this._camera);
          this.cabinetList[i] = {
            label: data[i].label,
            cpu: data[i].cpu,
            origin: newCabinet,
            cpuHot: null,
          };
        } else {
          const newCabinet = createCabinet(this._scene, `D-${i-24}`, new BABYLON.Vector3(-200, 101 / 2, - 180 + (i - 25) * 40), this._camera);
          this.cabinetList[i] = {
            label: data[i].label,
            cpu: data[i].cpu,
            origin: newCabinet,
            cpuHot: null,
          };
        }
      }
    });

    const air = BABYLON.MeshBuilder.CreateBox('air', { width: 50, height: 30, depth: 50}, this._scene);
    const airMat = new BABYLON.StandardMaterial('airMat', this._scene);
    air.material = airMat;
    air.position = new BABYLON.Vector3(200, 30 / 2, 250);
    air.enableEdgesRendering();
    air.edgesWidth = 100.0;
    air.edgesColor = new BABYLON.Color4(0, 0, 0.8, 1);

    const air2 = air.clone();
    const air2Mat = new BABYLON.StandardMaterial('air2Mat', this._scene);
    air.material = air2Mat;
    air2.position = new BABYLON.Vector3(-150, 30 / 2, 250);
    air2.enableEdgesRendering();
    air2.edgesWidth = 100.0;
    air2.edgesColor = new BABYLON.Color4(0, 0, 0.8, 1);

    // MouseOver
    const makeOverOut = (mesh, clickCallback) => {
      mesh.actionManager = new BABYLON.ActionManager(this._scene);
      mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
      mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "scaling", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));
      if (clickCallback) {
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
          trigger: BABYLON.ActionManager.OnPickDownTrigger,
          // parameter: 'r',
        }, clickCallback));
      }
    };
    makeOverOut(air, () => {
      (<any>window).displayAir('A1-1.A08.S..K-CRH-2.CR\n');
    });
    makeOverOut(air2, () => {
      (<any>window).displayAir('A1-1.B07.S..K-CRH-1.CR\n');
    });
  }

  createCpuHotMap = (): void => {
    this.cabinetList.forEach((cabinetItem, index): void => {
      const bar = BABYLON.MeshBuilder.CreateBox(cabinetItem.label, {
        height: 1.0,
        width: 29,
        depth: 29,
      }, this._scene);
      const originPosition = cabinetItem.origin.position;
      bar.position = new BABYLON.Vector3(originPosition.x, 0, originPosition.z);

      this.cabinetList[index].origin.material.alpha = 0.2;
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
    this._engine.runRenderLoop(() => {
      // console.log(`${this._camera.alpha}, ${this._camera.beta}`);
      this._scene.render();
    });

    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }
}

export default App;
