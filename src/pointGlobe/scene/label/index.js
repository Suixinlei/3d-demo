const THREE = require('three');
const htmlLabel = require('./htmlLabel');
const {
  convertLngLat,
  toScreenPosition,
} = require('../../utils');
const props = require('../../props');

class Label {
  constructor(data, scene) {
    this.scene = scene;
    this.data = data;
    this.init();

    const animation = document.createElement('div');
    animation.className = 'point-animation';
    document.body.appendChild(animation);
    this.animation = animation;
  }

  init() {
    const labelGeometry = new THREE.SphereGeometry( 2, 16, 16);
    const labelMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var label = new THREE.Mesh(labelGeometry, labelMaterial);

    const labelPosition = convertLngLat(this.data.lat, this.data.lng);
    label.position.x = labelPosition.x;
    label.position.y = labelPosition.y;
    label.position.z = labelPosition.z;
    this.scene.add(label);

    const labelDiv = new htmlLabel({
      text: this.data.LocalName,
      style: {
        position: 'absolute',
        color: '#00ffff',
        padding: '4px 8px',
        transform: this.data.textDirection === 'left' ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
        cursor: 'pointer',
      },
    });

    this.instance = label;
    this.div = labelDiv;
  }

  render(camera, renderer) {
    if (camera.position.distanceTo(this.instance.position) < (props.initCameraDistance - 100)) {
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

  hover() {
    this.instance.material.color.set(0xff0000);
  }

  unHover() {
    this.instance.material.color.set(0xffff00);
  }

  addAnimation(position) {
    this.animation.style.top = `${position.y}px`;
    this.animation.style.left = `${position.x}px`;
    this.animation.classList.add('show');
  }

  removeAnimation() {
    this.animation.classList.remove('show');
  }
}

module.exports = Label;
