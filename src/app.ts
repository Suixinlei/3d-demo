import * as BABYLON from 'babylonjs';
import worldAxis from './utils/worldAxis';

class App {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;
    private _globalCamera: BABYLON.FreeCamera;
    private _light: BABYLON.Light;
    private _assetsManager: BABYLON.AssetsManager;

    constructor(canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        // @ts-ignore
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene(): void {
        this._scene = new BABYLON.Scene(this._engine);

        // camera
        // this._camera = new BABYLON.ArcRotateCamera('camera1', - Math.PI / 2, Math.PI / 2, 30, BABYLON.Vector3.Zero(), this._scene);
        // this._camera.lowerBetaLimit = 0.1;
        // this._camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        // this._camera.lowerRadiusLimit = 30;
        // this._camera.upperRadiusLimit = 150;
        // this._camera.attachControl(this._canvas, false);

        this._globalCamera = new BABYLON.FreeCamera('camera2', new BABYLON.Vector3(35, 88, -60), this._scene);
        this._globalCamera.attachControl(this._canvas, false);

        // light
        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene);

        // skybox
        const skybox = BABYLON.Mesh.CreateBox('skybox', 500.0, this._scene);
        const skyboxMat = new BABYLON.StandardMaterial('skybox', this._scene);
        skyboxMat.backFaceCulling = false;
        skyboxMat.reflectionTexture = new BABYLON.CubeTexture("/textures/skybox", this._scene);
        skyboxMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMat.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMat.disableLighting = true;
        skybox.material = skyboxMat;
        skybox.infiniteDistance = true;

        // mesh
        let sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { segments: 16, diameter: 2 }, this._scene);
        sphere.position.y = 1;

        // 地板
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 128, height: 128, subdivisions: 2 }, this._scene);
        const groundMat = new BABYLON.StandardMaterial('ground', this._scene);
        groundMat.diffuseTexture = new BABYLON.Texture('/textures/albedo.png', this._scene);
        groundMat.backFaceCulling = false;
        ground.material = groundMat;

        worldAxis(this._scene, 16);
    }

    createAssetsManager(): void {
        this._assetsManager = new BABYLON.AssetsManager(this._scene);
        const rootUrl = 'http://127.0.0.1:9090/';
        // 机柜任务
        const cabinetTask = this._assetsManager.addMeshTask('cabinet', '', `${rootUrl}server/`, 'scene.gltf');
        cabinetTask.onSuccess = (task) => {
            console.log(task);
        };
        cabinetTask.onError = (task, message, exception) => {
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
