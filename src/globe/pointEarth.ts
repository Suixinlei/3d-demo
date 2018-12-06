import * as BABYLON from 'babylonjs';
import worldAxis from './utils/worldAxis';
import {countries, points} from './globePoints';

import * as addPoint from './utils/addPoint';

// Map properties for creation and rendering
var props = {
  mapSize: {
    // Size of the map from the intial source image (on which the dots are positioned on)
    width: 2048 / 2,
    height: 1024 / 2
  },
  globeRadius: 200, // Radius of the globe (used for many calculations)
  dotsAmount: 20, // Amount of dots to generate and animate randomly across the lines
  startingCountry: 'hongkong', // The key of the country to rotate the camera to during the introduction animation (and which country to start the cycle at)
  colours: {
    // Cache the colours
    globeDots: 'rgb(61, 137, 164)', // No need to use the Three constructor as this value is used for the HTML canvas drawing 'fillStyle' property
  },
  alphas: {
    // Transparent values of materials
    globe: 0.4,
    lines: 0.5
  }
};

function returnSphericalCoordinates(latitude, longitude) {

  /*
    This function will take a latitude and longitude and calcualte the
    projected 3D coordiantes using Mercator projection relative to the
    radius of the globe.

    Reference: https://stackoverflow.com/a/12734509
  */

  // Convert latitude and longitude on the 90/180 degree axis
  latitude = ((latitude - props.mapSize.width) / props.mapSize.width) * -180;
  longitude = ((longitude - props.mapSize.height) / props.mapSize.height) * -90;

  // Calculate the projected starting point
  var radius = Math.cos(longitude / 180 * Math.PI) * props.globeRadius;
  var targetX = Math.cos(latitude / 180 * Math.PI) * radius;
  var targetY = Math.sin(longitude / 180 * Math.PI) * props.globeRadius;
  var targetZ = Math.sin(latitude / 180 * Math.PI) * radius;

  return {
    x: targetX,
    y: targetY,
    z: targetZ
  };

}

class Earth {
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.ArcRotateCamera;
  private _light: BABYLON.Light;

  private earthSPS: BABYLON.SolidParticleSystem;
  private earth: BABYLON.Mesh;

  private completeNumber: number = 0;
  private globeReady: boolean = false;

  constructor(canvasElement: string) {
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = new BABYLON.Engine(this._canvas, true);
  }

  createScene(): void {
    this._scene = new BABYLON.Scene(this._engine);
    this._scene.clearColor = new BABYLON.Color4(1, 1, 1, 1);

    this._camera = new BABYLON.ArcRotateCamera('camera1', Math.PI, 0, 300, BABYLON.Vector3.Zero(), this._scene);
    this._camera.lowerBetaLimit = 0.1;
    this._camera.upperBetaLimit = Math.PI;
    this._camera.setPosition(new BABYLON.Vector3(300, 0, 0));
    this._camera.attachControl(this._canvas, false);
    // this._camera.useAutoRotationBehavior = true;
    // this._camera.autoRotationBehavior.idleRotationSpeed = 0.20;

    this._light = new BABYLON.HemisphericLight('light', this._camera.position, this._scene);
    this._light.specular = new BABYLON.Color3(0, 0, 0);

    worldAxis(this._scene, 512);

    this.earthSPS = new BABYLON.SolidParticleSystem('SPS', this._scene);
    this.earthSPS.billboard = true;
    const earthPoint = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 2, segments: 4 }, this._scene);
    const earthPointMat = new BABYLON.StandardMaterial('s-mat', this._scene);
    earthPointMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
    earthPoint.material = earthPointMat;
    const result = [];

    this.earthSPS.addShape(earthPoint, points.length);
    this.earth = this.earthSPS.buildMesh();
    this.earthSPS.computeParticleTexture = false;


    /// init
    this.earthSPS.updateParticle = (particle) => {
      const latlng = points[particle.idx];
      const pointPosition = returnSphericalCoordinates(
        latlng.x,
        latlng.y,
      );
      result.push(pointPosition);

      particle.color.r = 0.5;
      particle.color.b = 0.3;

      return particle;
    };
    this.earthSPS.setParticles();
    this.earthSPS.computeParticleColor = false;

    // animation
    const updateSpeed = 1;
    this.earthSPS.updateParticle = (particle): BABYLON.SolidParticle => {
      const pointPosition = result[particle.idx];
      let updateAble: Boolean = true;
      if (Math.abs(pointPosition.x - particle.position.x) >= updateSpeed) {
        if (pointPosition.x > 0) {
          particle.position.x += updateSpeed;
        } else {
          particle.position.x -= updateSpeed;
        }
        updateAble = false;
      } else {
        particle.position.x = pointPosition.x
      }
      if (Math.abs(pointPosition.y - particle.position.y) >= updateSpeed) {
        if (pointPosition.y > 0) {
          particle.position.y += updateSpeed;
        } else {
          particle.position.y -= updateSpeed;
        }
        updateAble = false;
      } else {
        particle.position.y = pointPosition.y;
      }
      if (Math.abs(pointPosition.z - particle.position.z) >= updateSpeed) {
        if (pointPosition.z > 0) {
          particle.position.z += updateSpeed;
        } else {
          particle.position.z -= updateSpeed;
        }
        updateAble = false;
      } else {
        particle.position.z = pointPosition.z;
      }

      if (updateAble) {
        this.completeNumber += 1;
      }

      return particle;
    };

    earthPoint.dispose();


    const manager = new BABYLON.GUI.GUI3DManager(this._scene);
    const hzPoint = addPoint('杭州', this._scene, manager);
  }

  doRender(): void {
    this._scene.registerAfterRender(() => {
      if (!this.globeReady) {
        this.completeNumber = 0;
        this.earthSPS.setParticles();
        if (this.completeNumber === this.earthSPS.nbParticles) {
          this.globeReady = true;
        }
      }
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
