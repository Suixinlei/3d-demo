import returnSphericalCoordinates from './returnSphericalCoordinates';

// Reference: https://codepen.io/ya7gisa0/pen/pisrm?editors=0010
export default function returnCurveCoordinates(latitudeA, longitudeA, latitudeB, longitudeB) {

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
