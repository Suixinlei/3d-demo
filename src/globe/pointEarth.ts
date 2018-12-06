import * as BABYLON from 'babylonjs';
import worldAxis from './utils/worldAxis';

import * as addPoint from './utils/addPoint';
import * as flyLine from './utils/flyLine';

class Earth {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;
    private _light: BABYLON.Light;

    private earth: BABYLON.Mesh;

    constructor(canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene(): void {
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.clearColor = new BABYLON.Color4(1, 1, 1, 1);

        this._camera = new BABYLON.ArcRotateCamera('camera1', Math.PI, 0, 250, BABYLON.Vector3.Zero(), this._scene);
        this._camera.lowerBetaLimit = 0.1;
        this._camera.upperBetaLimit = Math.PI;
        this._camera.setPosition(new BABYLON.Vector3(- 250, 0, 0));
        this._camera.attachControl(this._canvas, false);
        this._camera.useAutoRotationBehavior = true;
        this._camera.autoRotationBehavior.idleRotationSpeed = 0.10;

        this._light = new BABYLON.HemisphericLight('light', this._camera.position, this._scene);
        this._light.specular = new BABYLON.Color3(0, 0, 0);

        this.earth = BABYLON.MeshBuilder.CreateSphere('earth', { segments: 32, diameter: 256 }, this._scene);
        this.earth.rotation = new BABYLON.Vector3(Math.PI, Math.PI / 2, 0);
        const earthMaterial = new BABYLON.StandardMaterial('earth', this._scene);
        earthMaterial.ambientTexture = new BABYLON.Texture('/public/textures/globe_4096.png', this._scene);
        this.earth.material = earthMaterial;

        const manager = new BABYLON.GUI.GUI3DManager(this._scene);
        const hzPoint = addPoint('杭州', this._scene, manager);
        const shPoint = addPoint('上海', this._scene, manager);
        const bjPoint = addPoint('北京', this._scene, manager);
        const szPoint = addPoint('深圳', this._scene, manager);

        // flyLine(hzPoint, bjPoint, this._scene);

        worldAxis(this._scene, 512);
    }

    doRender(): void {
        this._scene.registerAfterRender(() => {
            // const { x, y } = BABYLON.Vector3.Project(this.hzPoint.position, BABYLON.Matrix.Identity(), this._scene.getTransformMatrix(), this._camera.viewport.toGlobal(this._engine));
            // this.hzPointLabel.style.top = `${y - 70}px`;
            // this.hzPointLabel.style.left = `${x - 40}px`;
            // console.log(this._scene.isActiveMesh(this.hzPoint));
            // console.log(this._scene.activeCamera.getActiveMeshes());
        });
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}

export default Earth;
