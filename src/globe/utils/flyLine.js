import * as BABYLON from 'babylonjs';


module.exports = (start, end, scene) => {
  start = start.position;
  end = end.position;

  const distanceBetween = BABYLON.Vector3.Distance(start, end);
  const distanceHalf = distanceBetween * 0.5;
  const mid = BABYLON.Vector3.Center(start, end);
  const midLength = mid.length() * 1.5;

  BABYLON.MeshBuilder.CreateSphere('a', { diameter: 16}, this._scene);
  console.log(distanceBetween, midLength);

};
() => {
var distanceBetweenCountryCenter = start.clone().sub(end).length();

//  midpoint for the curve
var mid = start.clone().lerp(end, 0.5);


var midLength = mid.length() * 1.5;
mid.normalize();
// mid.multiplyScalar( midLength + distanceBetweenCountryCenter * 0.7 );
mid.multiplyScalar(230);

//  the normal from start to end
var normal = (new THREE.Vector3()).subVectors(start, end);
normal.normalize();

var distanceHalf = distanceBetweenCountryCenter * 0.5;

var startAnchor = start.clone().setLength(210);
var midStartAnchor = mid.clone().add(normal.clone().multiplyScalar(distanceHalf));
var midEndAnchor = mid.clone().add(normal.clone().multiplyScalar(-distanceHalf));
var endAnchor = end.clone().setLength(210);

//  now make a bezier curve out of the above like so in the diagram
var splineCurveA = new THREE.CubicBezierCurve3(start, startAnchor, midStartAnchor, mid);
// splineCurveA.updateArcLengths();

var splineCurveB = new THREE.CubicBezierCurve3(mid, midEndAnchor, endAnchor, end);
// splineCurveB.updateArcLengths();

//  how many vertices do we want on this guy? this is for *each* side
var vertexCountDesired = Math.floor(/* splineCurveA.getLength()*/ distanceBetweenCountryCenter * 0.02 + 6) * 25;

//  collect the vertices
var points = splineCurveA.getPoints(vertexCountDesired);

//  remove the very last point since it will be duplicated on the next half of the curve
points = points.splice(0, points.length - 1);

points = points.concat(splineCurveB.getPoints(vertexCountDesired));
}
