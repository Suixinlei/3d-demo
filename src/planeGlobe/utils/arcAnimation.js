import * as BABYLON from 'babylonjs';

var ArcAnimation = function (scene, camera, ghostCamera, position) {
  ghostCamera.setPosition(position);
  console.log(ghostCamera.alpha);
  console.log(ghostCamera.beta);
  const toAlpha = ghostCamera.alpha;
  const toBeta = ghostCamera.beta;

  var animCamAlpha = new BABYLON.Animation("animCam", "alpha", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
  var keysAlpha = [];
  keysAlpha.push({
    frame: 0,
    value: camera.alpha
  });
  keysAlpha.push({
    frame: 100,
    value: toAlpha
  });

  var animCamBeta = new BABYLON.Animation("animCam", "beta", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
  var keysBeta = [];

  keysBeta.push({
    frame: 0,
    value: camera.beta
  });
  keysBeta.push({
    frame: 100,
    value: toBeta
  });

  animCamAlpha.setKeys(keysAlpha);
  animCamBeta.setKeys(keysBeta);
  camera.animations.push(animCamAlpha);
  camera.animations.push(animCamBeta);

  scene.beginAnimation(camera, 0, 100, false, 5);
};

export default ArcAnimation;
