import * as BABYLON from 'babylonjs';
import {countries, points} from '../globePoints';
import returnCurveCoordinates from './returnCurveCoordinates';

export default function addLine(scene, countryStart, countryEnd) {
  // Skip if the country is the same
  if (countryStart === countryEnd) {
    return;
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
  const line = BABYLON.MeshBuilder.CreateLines(`${countryStart} + ${countryEnd}`, { points: curve.getPoints() }, this._scene);
  return line;
}
