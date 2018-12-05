import * as BABYLON from 'babylonjs';

module.exports = (dot, radius) => {
  const lng = dot.lng;
  const lat = dot.lat;

  const aobDeg = lng * Math.PI / 180;
  const dobDeg = lat * Math.PI / 180;
  const ob = radius * Math.cos(dobDeg);
  const oc = ob * Math.sin(aobDeg);
  const oe = radius * Math.sin(dobDeg);
  const oa = ob * Math.cos(aobDeg);

  return new BABYLON.Vector3(
    - oc,
    oe,
    oa,
  );
};
