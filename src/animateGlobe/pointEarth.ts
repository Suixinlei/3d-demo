import * as BABYLON from 'babylonjs';

import worldAxis from './utils/worldAxis';
import {countries, points} from './globePoints';
import addPoint from './utils/addPoint';

// Map properties for creation and rendering
var props = {
  mapSize: {
    // Size of the map from the intial source image (on which the dots are positioned on)
    width: 2048 / 2,
    height: 1024 / 2
  },
  globeRadius: 128, // Radius of the globe (used for many calculations)
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
  },
  globeUpdateSpeed: 1,
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

  return new BABYLON.Vector3(-targetX, targetY, targetZ);
}

function originalUpdateParticles(particle) {
  return particle;
}

class Earth {
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.ArcRotateCamera;
  private _ghostCamera: BABYLON.ArcRotateCamera;
  private _light: BABYLON.Light;

  private earthSPS: BABYLON.SolidParticleSystem;
  private earth: BABYLON.Mesh;

  private globeReady: number = 0;
  private globeReadyStatus: boolean = false;

  private lightEffectEnable: boolean = false;
  private lightEffectAlpha: number = 0;

  constructor(canvasElement: string) {
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = new BABYLON.Engine(this._canvas, true);
  }

  createScene(): void {
    this._scene = new BABYLON.Scene(this._engine);
    this._scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.8);

    this._camera = new BABYLON.ArcRotateCamera('camera1', Math.PI, 0, 300, BABYLON.Vector3.Zero(), this._scene);
    this._camera.lowerBetaLimit = 0.1;
    this._camera.upperBetaLimit = Math.PI;
    this._camera.setPosition(new BABYLON.Vector3(- 300, 0, 0));
    this._camera.attachControl(this._canvas, false);
    this._camera.useAutoRotationBehavior = true;
    this._camera.autoRotationBehavior.idleRotationSpeed = 0.20;

    this._ghostCamera = new BABYLON.ArcRotateCamera('camera1', Math.PI, 0, 300, BABYLON.Vector3.Zero(), this._scene);

    this._light = new BABYLON.HemisphericLight('light', this._camera.position, this._scene);
    this._light.specular = new BABYLON.Color3(0, 0, 0);

    worldAxis(this._scene, 512);

    this.earthSPS = new BABYLON.SolidParticleSystem('SPS', this._scene);

    const earthPointMat = new BABYLON.StandardMaterial('mat1', this._scene);
    earthPointMat.backFaceCulling = false;
    const earthPointTexture = new BABYLON.Texture('/public/textures/flare2.png', this._scene);
    earthPointTexture.hasAlpha = true;
    earthPointMat.diffuseTexture = earthPointTexture;

    const earthPoint = BABYLON.MeshBuilder.CreatePlane('p', { size: 2 }, this._scene);
    const result = [];

    this.earthSPS.addShape(earthPoint, points.length);
    this.earth = this.earthSPS.buildMesh();
    this.earth.material = earthPointMat;
    earthPoint.dispose();

    /// init
    this.earthSPS.updateParticle = (particle) => {
      const latlng = points[particle.idx];
      const pointPosition = returnSphericalCoordinates(
        latlng.x,
        latlng.y,
      );
      result.push(pointPosition);

      return particle;
    };
    // this.earthSPS.mesh.rotation = new BABYLON.Vector3(Math.PI, Math.PI / 2, 0);
    this.earthSPS.billboard = true;
    this.earthSPS.computeParticleRotation = false;
    this.earthSPS.setParticles();
    this.earthSPS.computeParticleColor = false;

    const earthAnimation = new BABYLON.Animation("earthAnimation", "rotation.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
    earthAnimation.setKeys([
      {
        frame: 0,
        value: 0,
      },
      {
        frame: props.globeRadius / 2,
        value: -Math.PI,
      },
      {
        frame: props.globeRadius,
        value: -Math.PI * 2,
      },
    ]);
    this.earth.animations.push(earthAnimation);
    this._scene.beginAnimation(this.earth, 0, props.globeRadius, false, 1);

    // animation
    this.earthSPS.updateParticle = (particle): BABYLON.SolidParticle => {
      const pointPosition = result[particle.idx];

      const direction = pointPosition.subtract(particle.position);
      const distance = direction.length();
      if (distance > props.globeUpdateSpeed) {
        particle.position = particle.position.add(direction.normalize().scale(props.globeUpdateSpeed));
      } else {
        particle.position = pointPosition;
      }
      return particle;
    };
  }

  addTargetIdc(): void {
    addPoint(returnSphericalCoordinates(countries['pakistan'].x, countries['pakistan'].y), this._scene, this._camera, this._ghostCamera, (position) => {
      this.lightEffect(position);
    });
    addPoint(returnSphericalCoordinates(countries['india'].x, countries['india'].y), this._scene, this._camera, this._ghostCamera, (position) => {
      this.lightEffect(position);
    });
    addPoint(returnSphericalCoordinates(countries['nepal'].x, countries['nepal'].y), this._scene, this._camera, this._ghostCamera, (position) => {
      this.lightEffect(position);
    });
    addPoint(returnSphericalCoordinates(countries['philippines'].x, countries['philippines'].y), this._scene, this._camera, this._ghostCamera, (position) => {
      this.lightEffect(position);
    });
    addPoint(returnSphericalCoordinates(countries['hongkong'].x, countries['hongkong'].y), this._scene, this._camera, this._ghostCamera, (position) => {
      this.lightEffect(position);
    });
    addPoint(returnSphericalCoordinates(countries['china'].x, countries['china'].y), this._scene, this._camera, this._ghostCamera, (position) => {
      this.lightEffect(position);
    });
    addPoint(returnSphericalCoordinates(countries['srilanka'].x, countries['srilanka'].y), this._scene, this._camera, this._ghostCamera, (position) => {
      this.lightEffect(position);
    });
    addPoint(returnSphericalCoordinates(countries['bangladesh'].x, countries['bangladesh'].y), this._scene, this._camera, this._ghostCamera, (position) => {
      this.lightEffect(position);
    });
    addPoint(returnSphericalCoordinates(countries['thailand'].x, countries['thailand'].y), this._scene, this._camera, this._ghostCamera, (position) => {
      this.lightEffect(position);
    });
    addPoint(returnSphericalCoordinates(countries['malaysia'].x, countries['malaysia'].y), this._scene, this._camera, this._ghostCamera, (position) => {
      this.lightEffect(position);
    });
    addPoint(returnSphericalCoordinates(countries['singapore'].x, countries['singapore'].y), this._scene, this._camera, this._ghostCamera, (position) => {
      this.lightEffect(position);
    });
    addPoint(returnSphericalCoordinates(countries['indonesia'].x, countries['indonesia'].y), this._scene, this._camera, this._ghostCamera, (position) => {
      this.lightEffect(position);
    });
    addPoint(returnSphericalCoordinates(countries['vietnam'].x, countries['vietnam'].y), this._scene, this._camera, this._ghostCamera, (position) => {
      this.lightEffect(position);
    });
  }

  lightEffect(vector): void {
    this.earthSPS.computeParticleRotation = false;
    this.earthSPS.computeParticleVertex = false;
    this.earthSPS.computeParticleTexture = false;
    this.earthSPS.computeParticleColor = true;
    const distance: Array<number> = [];
    this.earthSPS.updateParticle = (particle) => {
      if (!distance[particle.idx]) {
        distance[particle.idx] = BABYLON.Vector3.Distance(particle.position, vector);
      }
      if (distance[particle.idx] < this.lightEffectAlpha && distance[particle.idx] > this.lightEffectAlpha - 30) {
        particle.color = new BABYLON.Color4(1, 0, 0, 1);

      } else {
        particle.color = new BABYLON.Color4(1, 1, 1, 1);
      }
      return particle;
    };

    this.lightEffectAlpha = 0;
    this.lightEffectEnable = true;
  }

  doRender(): void {
    this._scene.registerAfterRender(() => {
      if (!this.globeReadyStatus) {
        if (this.globeReady > props.globeRadius / props.globeUpdateSpeed) {
          this.globeReadyStatus = true;
          this.earthSPS.updateParticle = originalUpdateParticles;
          this.addTargetIdc();
        } else {
          this.globeReady += 1;
        }
      }
      if (this.lightEffectEnable) {
        this.lightEffectAlpha += 1;

        if (this.lightEffectAlpha > 256 + 30) {
          this.lightEffectEnable = false;
          this.earthSPS.updateParticle = originalUpdateParticles;
        }
      }
      this.earthSPS.setParticles();
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
