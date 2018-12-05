import * as BABYLON from 'babylonjs';
import worldAxis from './utils/worldAxis';

import createCabinet from './model/cabinet';

class App {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;
    private _light: BABYLON.Light;
    private _assetsManager: BABYLON.AssetsManager;

    private _center: BABYLON.String;

    constructor(canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene(): void {
        this._scene = new BABYLON.Scene(this._engine);

        // camera
        this._camera = new BABYLON.ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 2, 150, BABYLON.Vector3.Zero(), this._scene);
        this._camera.lowerBetaLimit = 0.1;
        this._camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        this._camera.lowerRadiusLimit = 60;
        this._camera.upperRadiusLimit = 500;
        this._camera.attachControl(this._canvas, false);

        // light
        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 100, 0), this._scene);

        const times = 20;
        const separate = 10;
        for (let i = 0; i < 800; i++) {
            const newCabinet = createCabinet(this._scene);
            newCabinet.position = new BABYLON.Vector3((20 - Math.floor(i / times)) * separate * 2, 30, (10 - (i % times)) * separate);
            newCabinet.actionManager = new BABYLON.ActionManager(this._scene);
            newCabinet.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, newCabinet.material, "emissiveColor", new BABYLON.Color3(0, 0, 0)));
            newCabinet.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, newCabinet.material, "emissiveColor", BABYLON.Color3.White()));
            newCabinet.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
                if (this._center) {
                    const cabinetOld = this._scene.getMeshByID(this._center);
                    cabinetOld.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                }
                this._center = newCabinet.id;
                newCabinet.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                window.changeDisplay(2);
            }))
        }

        worldAxis(this._scene, 64);
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
