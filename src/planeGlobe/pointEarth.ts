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
  private _light: BABYLON.Light;

  private earthSPS: BABYLON.SolidParticleSystem;
  private earth: BABYLON.Mesh;

  private impact: BABYLON.Mesh;

  constructor(canvasElement: string) {
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = new BABYLON.Engine(this._canvas, true);
  }

  createScene(): void {
    this._scene = new BABYLON.Scene(this._engine);
    // this._scene.clearColor = props.sceneClearColor;

    this._camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(1000, 500, 800), this._scene);
    this._camera.rotation = new BABYLON.Vector3(0, - Math.PI, 0);
    this._camera.attachControl(this._canvas, false);
    // this._camera.cameraDirection = new BABYLON.Vector3(0, 0, 0);

    this._light = new BABYLON.HemisphericLight('light', this._camera.position, this._scene);
    this._light.specular = new BABYLON.Color3(0, 0, 0);

    var pl = new BABYLON.PointLight("pl", new BABYLON.Vector3(0, 0, 0), this._scene);
    pl.diffuse = new BABYLON.Color3(1, 1, 1);
    pl.intensity = 1.0;

    worldAxis(this._scene, 512);

    var fact = 100; 			// cube size
    this.earthSPS = new BABYLON.SolidParticleSystem('SPS', this._scene, { updatable: false });
    const earthPoint = BABYLON.MeshBuilder.CreateSphere('p', { diameter: 2, segments: 4, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, this._scene);
    this.earthSPS.addShape(earthPoint, points.length, {
      positionFunction: (particle, i, s) => {
        const latlng = points[i];
        particle.position = new BABYLON.Vector3(latlng.x, latlng.y, 0);
        particle.color = new BABYLON.Color4(particle.position.x / fact + 0.5, particle.position.y / fact + 0.5, particle.position.z / fact + 0.5, 1.0);
        return particle;
      }
    });
    this.earth = this.earthSPS.buildMesh();
    earthPoint.dispose();

    const earthGround = BABYLON.MeshBuilder.CreatePlane('earthPlane', { width: 2000, height: 2000, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, this._scene);
    earthGround.position = new BABYLON.Vector3(1000, 1000, -5);

    this.impact = BABYLON.MeshBuilder.CreatePlane("impact", { size: 10, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, this._scene);
    const impactMat = new BABYLON.StandardMaterial("impactMat", this._scene)
    impactMat.diffuseTexture = new BABYLON.Texture("/public/textures/impact.png", this._scene);
    impactMat.diffuseTexture.hasAlpha = true;
    this.impact.material = impactMat;
    this.impact.position = new BABYLON.Vector3(0, 0, 0.1);

  }

  doRender(): void {
    this._scene.onPointerDown = (evt, pickResult) => {
      if (pickResult.hit) {
        this.impact.position.x = pickResult.pickedPoint.x;
        this.impact.position.y = pickResult.pickedPoint.y;
        console.log(`{ "x": ${Math.floor(this.impact.position.x)}, "y": ${Math.floor(this.impact.position.y)}, "name": "233"}`);
      }
    };
    this._scene.registerAfterRender(() => {
      // console.log(this._camera.rotation);
      // this.earthSPS.setParticles();
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
