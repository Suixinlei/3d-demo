import * as BABYLON from 'babylonjs';

import worldAxis from './utils/worldAxis';
import {countries, points} from './globePoints';
import addPoint from './utils/addPoint';
import addLine from './utils/addLine';
import returnSphericalCoordinates from './utils/returnSphericalCoordinates';
import props from './props';


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
  private earthInnerMask: BABYLON.Mesh;

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
    this._scene.clearColor = props.sceneClearColor;

    this._camera = new BABYLON.ArcRotateCamera('camera1', Math.PI, 0, 300, BABYLON.Vector3.Zero(), this._scene);
    this._camera.lowerBetaLimit = 0.1;
    this._camera.upperBetaLimit = Math.PI;
    this._camera.lowerRadiusLimit = 150;
    this._camera.upperRadiusLimit = 400;
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
    earthPointMat.emissiveColor = new BABYLON.Color3(1, 1, 1);

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
      particle.color = new BABYLON.Color4(1, 1, 1, 1);

      return particle;
    };
    this.earthSPS.billboard = true;
    this.earthSPS.computeParticleRotation = false;
    this.earthSPS.setParticles();
    this.earthSPS.computeParticleColor = false;

    /// init earthInner
    this.earthInnerMask = BABYLON.MeshBuilder.CreateSphere('earthInner', { diameter: 1 }, this._scene);
    this.earthInnerMask.parent = this.earth;
    const earthInnerMaskMat = new BABYLON.StandardMaterial('earthInner', this._scene);
    earthInnerMaskMat.alpha = 0.8;
    earthInnerMaskMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
    this.earthInnerMask.material = earthInnerMaskMat;
    /// earthInner animation
    const earthInnerAnimation = new BABYLON.Animation('earthInnerAnimation', 'scaling', 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3);
    earthInnerAnimation.setKeys([
      {
        frame: 0,
        value: new BABYLON.Vector3(1, 1, 1),
      },
      {
        frame: props.globeRadius / 2,
        value: new BABYLON.Vector3(props.globeRadius - 10, props.globeRadius - 10, props.globeRadius - 10),
      },
      {
        frame: props.globeRadius,
        value: new BABYLON.Vector3(props.globeRadius * 2 - 10, props.globeRadius * 2 - 10, props.globeRadius * 2 - 10),
      },
    ]);
    this.earthInnerMask.animations.push(earthInnerAnimation);
    this._scene.beginAnimation(this.earthInnerMask, 0, props.globeRadius, false, 1);

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
    const countryNames = Object.keys(countries);
    for (const countryName of countryNames) {
      addPoint(returnSphericalCoordinates(countries[countryName].x, countries[countryName].y), this._scene, this._camera, this._ghostCamera, (position) => {
        this.lightEffect(position);
      });
    }

    // add line
    this.addLines();
  }

  addLines(): void {
    const countryNames = Object.keys(countries);
    addLine(this._scene, 'hangzhou', 'shanghai');
    addLine(this._scene, 'beijing', 'shanghai');
    addLine(this._scene, 'beijing', 'hangzhou');
    addLine(this._scene, 'hangzhou', 'hongkong');

    for (const countryStart of countryNames) {
      addLine(this._scene, 'hangzhou', countryStart);
    }
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


    this._scene.onPointerDown = (event, pickResult) => {
      if (pickResult.hit && pickResult.pickedMesh instanceof BABYLON.LinesMesh) {
        pickResult.pickedMesh.edgesColor = new BABYLON.Color4(1, 0, 0, 1);
      }
    };

    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }
}

export default Earth;
