const props = {
  initCameraDistance: 900,
  globeRadius: 512,
  innerGlobeRadius: 510,
  mapSize: {
    // Size of the map from the intial source image (on which the dots are positioned on)
    width: 358 / 2,
    height: 179 / 2
  },
  mapBorderSize: {
    width: 746 / 2,
    height: 374 / 2,
  }
};

module.exports = props;
