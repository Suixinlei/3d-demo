import * as BABYLON from 'babylonjs';
import * as queryString from 'query-string';
import worldAxis from './utils/worldAxis';
import createLabel from './utils/createLabel';

class App {
    private _idcName: String;
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;
    private _light: BABYLON.Light;
    private _assetsManager: BABYLON.AssetsManager;

    private exitStatus: Boolean;

    constructor(canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);

        const query = queryString.parse(location.search);
        this._idcName = query.name;
    }

    createScene(): void {
        this._scene = new BABYLON.Scene(this._engine);

        // camera
        this._camera = new BABYLON.ArcRotateCamera('camera1', 7.94165764085017, 0.6713277883003996, 300, BABYLON.Vector3.Zero(), this._scene);
        this._camera.lowerBetaLimit = 0.1;
        this._camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        this._camera.lowerRadiusLimit = 100;
        this._camera.upperRadiusLimit = 500;
        this._camera.attachControl(this._canvas, false);

        // light
        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene);
        const light2 = new BABYLON.DirectionalLight('direction', new BABYLON.Vector3(100, -300, -100), this._scene);

        // ground
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 400, height: 400 }, this._scene);
        ground.position = new BABYLON.Vector3(50, 0, 0);
        const groundMat = new BABYLON.StandardMaterial('mat1', this._scene);
        // groundMat.diffuseColor = new BABYLON.Color3(0.502, 0.502, 0.502);
        groundMat.diffuseColor = BABYLON.Color3.White();
        groundMat.alpha = 0.8;
        ground.material = groundMat;

        if (process.env.NODE_ENV === 'development') {
            worldAxis(this._scene, 128);
        }
    }

    createAssetsManager(): void {
        this._assetsManager = new BABYLON.AssetsManager(this._scene);
        // 建立大背景
        const idcTask = this._assetsManager.addMeshTask('idc', '', '/public/resource/', '机房模型-1.obj');
        idcTask.onSuccess = (task) => {
            const label1 = createLabel(this._scene, 'NA61-A', new BABYLON.Vector3(150, 50, -80), () => {
                console.log('NA61-A');
                (<any>window).changeDisplay('NA61-A栋');
            });
            const label2 = createLabel(this._scene, 'NA61-B', new BABYLON.Vector3(150, 50, 0), () => {
                console.log('NA61-B');
                (<any>window).changeDisplay('NA61-B栋');
            });
            this._scene.registerAfterRender(() => {
                if (label1 && label2) {
                    label1.lookAt(this._camera.position);
                    label2.lookAt(this._camera.position);
                }
            });
            // task.loadedMeshes[1].position = new BABYLON.Vector3(0, 100, 0);
        };
        idcTask.onError = (task, message, exception) => {
            console.log(task, message, exception);
        };

        this._assetsManager.load();
    }

    doRender(): void {
        this._scene.registerAfterRender(() => {
            // console.log(this._camera.alpha, this._camera.beta);
        });
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
