const THREE = require('three');
const htmlLabel = require('./htmlLabel');
const {
  convertLngLat,
  toScreenPosition,
} = require('../../utils');

class Label {
  constructor(data, scene) {
    this.scene = scene;
    this.data = data;
    this.init();
  }

  init() {
    const labelGeometry = new THREE.SphereGeometry( 2, 8, 8 );
    const labelMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var label = new THREE.Mesh(labelGeometry, labelMaterial);

    const labelPosition = convertLngLat(39.9042, 116.4074);
    label.position.x = labelPosition.x;
    label.position.y = labelPosition.y;
    label.position.z = labelPosition.z;
    this.scene.add(label);

    const labelDiv = new htmlLabel({
      text: '北京',
      style: {
        position: 'absolute',
        color: '#00ffff',
      },
    });

    this.instance = label;
    this.div = labelDiv;
  }

  render(camera, renderer) {
    if (camera.position.distanceTo(this.instance.position) < 700) {
      const absolutePosition = toScreenPosition(this.instance, renderer, camera);
      if (absolutePosition.y > 0 && absolutePosition.x > 0) {
        this.div.set({
          left: absolutePosition.x + 'px',
          top: absolutePosition.y + 'px',
          display: 'block',
        });
      } else {
        this.div.set({
          display: 'none',
        });
      }
    } else {
      this.div.set({
        display: 'none',
      });
    }
  }
}

module.exports = Label;
