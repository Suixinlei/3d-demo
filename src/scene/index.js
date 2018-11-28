import * as BABYLON from 'babylonjs';

// createScene function that creates and return the scene
function createScene(engine) {
  // create a basic BJS Scene object
  var scene = new BABYLON.Scene(engine);

  // return the created scene
  return scene;
}

module.exports = createScene;
