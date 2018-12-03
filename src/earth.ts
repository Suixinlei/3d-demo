import * as BABYLON from 'babylonjs';
import worldAxis from './utils/worldAxis';

import * as geoData from './utils/geo';
import * as convertLngLat from './utils/convertLngLat';
import * as addPoint from './utils/addPoint';

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

        this._camera = new BABYLON.ArcRotateCamera('camera1', 0, 0, 200, BABYLON.Vector3.Zero(), this._scene);
        this._camera.lowerBetaLimit = 0.1;
        this._camera.upperBetaLimit = Math.PI;

        this._camera.setPosition(new BABYLON.Vector3(0, 0, 180));
        this._camera.attachControl(this._canvas, false);
        // this._camera.useAutoRotationBehavior = true;
        // this._camera.autoRotationBehavior.idleRotationSpeed = 0.10;

        this._light = new BABYLON.HemisphericLight('light', this._camera.position, this._scene);
        this._light.specular = new BABYLON.Color3(0, 0, 0);

        this.earth = BABYLON.MeshBuilder.CreateSphere('earth', { segments: 32, diameter: 256 }, this._scene);
        this.earth.rotation = new BABYLON.Vector3(Math.PI, Math.PI / 2, 0);
        const earthMaterial = new BABYLON.StandardMaterial('earth', this._scene);
        earthMaterial.ambientTexture = new BABYLON.Texture('/textures/globe_4096.png', this._scene);
        this.earth.material = earthMaterial;

        // const lngLat = geoData['黑龙江省'];
        // const realPosition = convertLngLat(lngLat, 128);
        // addPoint(realPosition, this._scene);

        addPoint(convertLngLat({
            lat: 29, // 纬度
            lng: 120 // 经度
        }, 128), this._scene);

        worldAxis(this._scene, 512);

        // let alpha = 0;
        // this._scene.beforeRender = () => {
        //     this.earth.rotation.y = alpha;
        //     alpha -= 0.01;
        // }
    }

    doRender(): void {
        // this._scene.registerBeforeRender(() => {
            // console.log(this._camera.autoRotationBehavior);
        // });
        this._engine.runRenderLoop(() => {
            // console.log(this._camera.globalPosition)
            this._scene.render();
        });

        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}

export default Earth;
