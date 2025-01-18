import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import pointEarth from '../../scene/pointEarth/index';
import pointEarthBorder from '../../scene/pointEarthBorder';
import props from '../../scene/props';

// 基础场景设置
const scene = new THREE.Scene();
scene.background = new THREE.Color('#333');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 900;

// 设置相机位置
camera.position.set(209.39, 439.69, 634.69);
// 设置相机旋转
camera.rotation.set(-0.61, 0.26, 0.18);

const canvas = document.querySelector('#c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setPixelRatio(window.devicePixelRatio);

// 光照
const ambient = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambient);
const pointLight = new THREE.PointLight(0xffffff, 5, 1000);
scene.add(pointLight);

// 控制器
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.minDistance = 500;
// controls.maxDistance = 1000;
// controls.enableDamping = true;
// controls.dampingFactor = 0.05;
// controls.rotateSpeed = 0.1;
// controls.enablePan = false;
// controls.update();

// 初始化地球
pointEarth.Init(scene);
pointEarthBorder.Init(scene);

// 添加实心球体
const sphere = new THREE.Mesh(new THREE.SphereGeometry(props.globeRadius, 64, 64), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 }));
scene.add(sphere);

// 调整点光源位置，让球体更有立体感
pointLight.position.set(800, 800, 800);

// 渲染函数
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
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  const delta = clock.getDelta();
  pointEarth.update(delta);

  // 镜头持续向右旋转
  camera.position.x = camera.position.x * Math.cos(0.001) + camera.position.z * Math.sin(0.001);
  camera.position.z = camera.position.z * Math.cos(0.001) - camera.position.x * Math.sin(0.001);
  camera.lookAt(scene.position);
  
  renderer.render(scene, camera);
}

// 动画循环
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  render();
}

// 事件监听
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

// 启动
render();
animate();
