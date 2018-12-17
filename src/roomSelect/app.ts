import * as BABYLON from 'babylonjs';
import * as queryString from 'query-string';
import worldAxis from './utils/worldAxis';
import createLabel from './utils/createLabel';

const parsedQuery = queryString.parse(location.search);

class App {
    private _idcName: String;
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;
    private _light: BABYLON.Light;

    constructor(canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);

        const query = queryString.parse(location.search);
        this._idcName = query.name;
    }

    createScene(): void {
        this._scene = new BABYLON.Scene(this._engine);

        // camera
        this._camera = new BABYLON.ArcRotateCamera('camera1', 8.081757598903184, 0.7679233782762465, 500, BABYLON.Vector3.Zero(), this._scene);
        // this._camera.lowerBetaLimit = 0.3;
        // this._camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        this._camera.lowerRadiusLimit = 300;
        this._camera.upperRadiusLimit = 800;
        this._camera.attachControl(this._canvas, false);

        // light
        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene);
        const light2 = new BABYLON.DirectionalLight('direction', new BABYLON.Vector3(100, -300, -100), this._scene);

        // props
        const wallHeight = 30;
        const wallWidth = 800;
        const wallDepth = 300;
        const wallThickness = 10;

        // ground
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: wallWidth, height: wallDepth }, this._scene);
        const groundMat = new BABYLON.StandardMaterial('mat1', this._scene);
        // groundMat.diffuseColor = new BABYLON.Color3(0.502, 0.502, 0.502);
        groundMat.diffuseColor = BABYLON.Color3.White();
        groundMat.alpha = 0.8;
        ground.material = groundMat;

        // wall
        const wall1 = BABYLON.MeshBuilder.CreateBox('wall1', { width: wallWidth, height: wallHeight, depth: wallThickness }, this._scene);
        wall1.position = new BABYLON.Vector3(0, wallHeight / 2, -wallDepth / 2);
        const wall2 = wall1.clone();
        wall2.position = new BABYLON.Vector3(0, wallHeight / 2, wallDepth / 2);
        const wall3 = BABYLON.MeshBuilder.CreateBox('wall1', { width: wallThickness, height: wallHeight, depth: wallDepth }, this._scene);
        wall3.position = new BABYLON.Vector3(wallWidth / 2, wallHeight / 2, 0);
        const wall4 = wall3.clone();
        wall4.position = new BABYLON.Vector3(-wallWidth / 2, wallHeight/ 2, 0);
        // inside wall
        const wall5 = wall3.clone();
        wall5.position = new BABYLON.Vector3(wallWidth / 4, wallHeight / 2, 0);
        const wall6 = wall3.clone();
        wall6.position = new BABYLON.Vector3(0, wallHeight/ 2, 0);
        const wall7 = wall3.clone();
        wall7.position = new BABYLON.Vector3(-wallWidth / 4, wallHeight / 2, 0);
        const wall8 = wall1.clone();
        wall8.position = new BABYLON.Vector3(0, wallHeight / 2, 0);

        const labelList = [];
        const positionArray = [
            new BABYLON.Vector3(wallWidth / 8 * 3, wallHeight,  - wallDepth / 4),
            new BABYLON.Vector3(wallWidth / 8 * 3, wallHeight,  wallDepth / 4),
            new BABYLON.Vector3(wallWidth / 8, wallHeight,  - wallDepth / 4),
            new BABYLON.Vector3(wallWidth / 8, wallHeight,  wallDepth / 4),
            new BABYLON.Vector3(- wallWidth / 8, wallHeight,  - wallDepth / 4),
            new BABYLON.Vector3(- wallWidth / 8, wallHeight,  wallDepth / 4),
            new BABYLON.Vector3(- wallWidth / 8 * 3, wallHeight,  - wallDepth / 4),
            new BABYLON.Vector3(- wallWidth / 8 * 3, wallHeight,  wallDepth / 4),
        ];
        for (let i = 0; i < 8; i++) {
            labelList.push(createLabel(this._scene, `${parsedQuery.building}${parsedQuery.level}-${i+1}`, positionArray[i], () => {
                window.location.href = `/room?name=${parsedQuery.name}&building=${parsedQuery.building}&level=${parsedQuery.level}&roomNo=${i+1}`;
            }));
        }

        this._scene.registerAfterRender(() => {
            for (const label of labelList) {
                label.lookAt(this._camera.position);
            }
        });

        if (process.env.NODE_ENV === 'development') {
            worldAxis(this._scene, 128);
        }
    }

    doRender(): void {
        this._scene.registerAfterRender(() => {
            // console.log(this._camera.alpha, this._camera.beta);
        });
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}

export default App;
