import * as BABYLON from 'babylonjs';
import * as queryString from 'query-string';
import worldAxis from './utils/worldAxis';

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
        this._camera = new BABYLON.ArcRotateCamera('camera1', 8.29, 1.09, 128, BABYLON.Vector3.Zero(), this._scene);
        this._camera.lowerBetaLimit = 0.1;
        this._camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        this._camera.lowerRadiusLimit = 30;
        this._camera.upperRadiusLimit = 300;
        this._camera.attachControl(this._canvas, false);
        this._camera.useAutoRotationBehavior = true;

        // light
        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene);

        // skybox
        const skybox = BABYLON.Mesh.CreateBox('skybox', 5000.0, this._scene);
        const skyboxMat = new BABYLON.StandardMaterial('skybox', this._scene);
        skyboxMat.backFaceCulling = false;
        skyboxMat.reflectionTexture = new BABYLON.CubeTexture("/public/textures/skybox", this._scene);
        skyboxMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMat.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMat.disableLighting = true;
        skybox.material = skyboxMat;
        skybox.infiniteDistance = true;

        const idcBox = BABYLON.MeshBuilder.CreateBox('idcBox', {
            width: 80,
            depth: 80,
            height: 120,
        }, this._scene);
        const idcBoxMat = new BABYLON.StandardMaterial('idcBox', this._scene);
        idcBoxMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        idcBoxMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        idcBoxMat.emissiveColor = BABYLON.Color3.Red();
        idcBox.material = idcBoxMat as BABYLON.StandardMaterial;
        idcBox.position = new BABYLON.Vector3(0, -100, -270);

        idcBox.actionManager = new BABYLON.ActionManager(this._scene);
        idcBox.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, idcBox.material, "emissiveColor", idcBoxMat.emissiveColor));
        idcBox.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, idcBox.material, "emissiveColor", BABYLON.Color3.White()));
        idcBox.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, idcBox, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
        idcBox.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, idcBox, "scaling", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));
        idcBox.actionManager.registerAction(new BABYLON.IncrementValueAction(BABYLON.ActionManager.OnEveryFrameTrigger, idcBox, "rotation.y", 0.01));
        idcBox.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, () => {
            this._camera.target = idcBox.position;
            idcBox.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnDoublePickTrigger, () => {
                this.exitStatus = true;
            }));
        }));


        worldAxis(this._scene, 16);
    }

    createAssetsManager(): void {
        this._assetsManager = new BABYLON.AssetsManager(this._scene);
        // 建立大背景
        const idcTask = this._assetsManager.addMeshTask('idc', '', '/public/resource/tiny_city/', 'scene.gltf');
        idcTask.onSuccess = (task) => {
            for (const mesh of task.loadedMeshes) {
                mesh.scaling = new BABYLON.Vector3(20, 20, 20);
            }
        };
        idcTask.onError = (task, message, exception) => {
            console.log(task, message, exception);
        };

        this._assetsManager.load();
    }

    doRender(): void {
        this._scene.registerAfterRender(() => {
            if (this.exitStatus) {
                this._camera.radius -= 3;
                console.log(this._camera.radius);
                if (this._camera.radius < 50) {
                    window.location.href = `/room?name=${this._idcName}`;
                }
            }
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
