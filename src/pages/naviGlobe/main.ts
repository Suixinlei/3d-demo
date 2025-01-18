import * as THREE from 'three';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import Stats from 'stats.js';
import TWEEN from 'tween';
import * as dat from 'dat.gui';

import pointEarth from '../../scene/pointEarth/index';
import pointEarthBorder from '../../scene/pointEarthBorder';
import props from '../../scene/props';

import routeData from './route.json';

let renderRequested = false;
interface Postprocessing {
  composer?: EffectComposer;
}
const postprocessing: Postprocessing = {};

let width = window.innerWidth;
let height = window.innerHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#333');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 850;
scene.add(camera);

const canvas = document.querySelector('#c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.autoClear = false;

// clock
const clock = new THREE.Clock();

// 环境光
const ambient = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambient);
// 点状光源
const pointLight = new THREE.PointLight(0xffffff, 5, 1000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);
var sphereSize = 5;
var pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
scene.add(pointLightHelper);

// stats
const stats = new Stats();
document.body.appendChild(stats.dom);

const settings = {
  maxVisibleDot: 1,
  showPath: false,
};

const gui = new dat.GUI({ width: 300 });
gui.add(settings, 'maxVisibleDot', -1, 1, 0.01).onChange(requestRenderIfNotRequested);
gui.add(settings, 'showPath').name('显示路径').onChange((value) => {
  line.visible = value;
  requestRenderIfNotRequested();
});

pointEarth.Init(scene);
pointEarthBorder.Init(scene);
initPostprocessing();

function initPostprocessing(): EffectComposer {
  const renderPass = new RenderPass(
    scene,
    camera,
    undefined, // overrideMaterial
    undefined, // clearColor
    1.0 // clearAlpha
  );
  const composer = new EffectComposer(renderer);
  composer.addPass(renderPass);
  postprocessing.composer = composer;
  return composer;
}

// 画出路径点
const curve = new THREE.CatmullRomCurve3(routeData.map(p => {
  return new THREE.Vector3(...p);
}), true);

// 将路径点绘制到场景中
const points = curve.getPoints(50);
const extendedPoints = points.map(p => p.normalize().multiplyScalar(props.globeRadius + 10));
const line = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(extendedPoints),
  new THREE.LineBasicMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  })
);
line.visible = settings.showPath;
scene.add(line);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(props.globeRadius, 64, 64), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 }));
scene.add(sphere);

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function render() {
  renderRequested = undefined;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  const delta = clock.getDelta();
  pointEarth.update(delta);
  var time = Date.now();
  var looptime = 60 * 1000;
  var t = (time % looptime) / looptime;
  var pos = curve.getPointAt(t).setLength(props.initCameraDistance);
  camera.lookAt(pos.setLength(props.globeRadius + 20));
  camera.position.copy(pos);

  // 使用 composer 进行渲染
  postprocessing.composer.render(delta);
}

const animate = () => {
  requestAnimationFrame(animate);

  TWEEN.update();
  stats.update();

  render();
};

function requestRenderIfNotRequested() {
  if (!renderRequested) {
    renderRequested = true;
    requestAnimationFrame(render);
  }

  width = window.innerWidth;
  height = window.innerHeight;

  // 更新 composer 的尺寸
  if (postprocessing.composer) {
    postprocessing.composer.setSize(width, height);
  }
}

window.addEventListener('resize', requestRenderIfNotRequested);

render();
animate();