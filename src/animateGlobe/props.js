import * as BABYLON from 'babylonjs';

// Map properties for creation and rendering
export default {
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
