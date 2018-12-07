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
  sceneClearColor: new BABYLON.Color4(0, 0, 0, 0.8),
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


// Reference: https://codepen.io/ya7gisa0/pen/pisrm?editors=0010
function returnCurveCoordinates(latitudeA, longitudeA, latitudeB, longitudeB) {

  // Calculate the starting point
  var start = returnSphericalCoordinates(latitudeA, longitudeA);

  // Calculate the end point
  var end = returnSphericalCoordinates(latitudeB, longitudeB);

  // Calculate the mid-point
  var midPointX = (start.x + end.x) / 2;
  var midPointY = (start.y + end.y) / 2;
  var midPointZ = (start.z + end.z) / 2;

  // Calculate the distance between the two coordinates
  var distance = Math.pow(end.x - start.x, 2);
  distance += Math.pow(end.y - start.y, 2);
  distance += Math.pow(end.z - start.z, 2);
  distance = Math.sqrt(distance);

  // Calculate the multiplication value
  var multipleVal = Math.pow(midPointX, 2);
  multipleVal += Math.pow(midPointY, 2);
  multipleVal += Math.pow(midPointZ, 2);
  multipleVal = Math.pow(distance, 2) / multipleVal;
  multipleVal = multipleVal * 0.7;

  // Apply the vector length to get new mid-points
  var midX = midPointX + multipleVal * midPointX;
  var midY = midPointY + multipleVal * midPointY;
  var midZ = midPointZ + multipleVal * midPointZ;

  // Return set of coordinates
  return {
    start: {
      x: start.x,
      y: start.y,
      z: start.z
    },
    mid: {
      x: midX,
      y: midY,
      z: midZ
    },
    end: {
      x: end.x,
      y: end.y,
      z: end.z
    }
  };

}

function originalUpdateParticles(particle) {
  return particle;
}

class Earth {
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.FreeCamera;
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
    // this._camera.rotation.z = Math.PI;
    // this._camera.upperRadiusLimit = 400;
    // this._camera.setPosition(new BABYLON.Vector3(- 300, 0, 0));
    this._camera.attachControl(this._canvas, false);

    // this._camera.useAutoRotationBehavior = true;
    // this._camera.autoRotationBehavior.idleRotationSpeed = 0.20;

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
      particle.color = new BABYLON.Color4(1, 1, 1, 1);
      particle.position = new BABYLON.Vector3(latlng.x, latlng.y, 0);

      return particle;
    };
    this.earthSPS.billboard = true;
    this.earthSPS.computeParticleRotation = false;
    this.earthSPS.setParticles();
    this.earthSPS.computeParticleColor = false;
  }

  addLines(): void {
    const countryNames = Object.keys(countries);
    for (var countryStart of countryNames) {
      for (var countryEnd of countryNames) {
        // Skip if the country is the same
        if (countryStart === countryEnd) {
          continue;
        }

        // Get the spatial coordinates
        var result = returnCurveCoordinates(
          countries[countryStart].x,
          countries[countryStart].y,
          countries[countryEnd].x,
          countries[countryEnd].y
        );

        // Calcualte the curve in order to get points from
        const curve = BABYLON.Curve3.CreateQuadraticBezier(
          new BABYLON.Vector3(result.start.x, result.start.y, result.start.z),
          new BABYLON.Vector3(result.mid.x, result.mid.y, result.mid.z),
          new BABYLON.Vector3(result.end.x, result.end.y, result.end.z),
          200
        );

        // Create mesh line using plugin and set its geometry
        const line = BABYLON.MeshBuilder.CreateLines(`${countryStart} + ${countryEnd}`, { points: curve.getPoints() }, this._scene)
        line.parent = this.earthInnerMask;
      }
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
      // if (!this.globeReadyStatus) {
      //   if (this.globeReady > props.globeRadius / props.globeUpdateSpeed) {
      //     this.globeReadyStatus = true;
      //     this.earthSPS.updateParticle = originalUpdateParticles;
      //     this.addTargetIdc();
      //   } else {
      //     this.globeReady += 1;
      //   }
      // }
      // if (this.lightEffectEnable) {
      //   this.lightEffectAlpha += 1;
      //
      //   if (this.lightEffectAlpha > 256 + 30) {
      //     this.lightEffectEnable = false;
      //     this.earthSPS.updateParticle = originalUpdateParticles;
      //   }
      // }
      this._camera.rotation.x += 0.1;
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
