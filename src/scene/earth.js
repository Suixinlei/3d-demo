/** !
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   笑斌 <xinlei.sxl@alibaba-inc.com> (https://work.alibaba-inc.com/work/u/102912)
 */

const THREE = require('three');

// 地球材质
const earthVertexShader = require('../glsl/earth/vertexShader.glsl');
const earthFragmentShader = require('../glsl/earth/fragmentShader.glsl');

function earthInit(scene, opt = {
  // 内层框架是否可视
  insideWireframe: false,
  // 外层框架是否可视
  outsideWireframe: false,
  // 内层可视
  insideVisible: true,
  // 外层可视
  outsideVisible: true,
  // 内层发光颜色
  innerGlowColor: new THREE.Vector3(0.0, 0.3, 0.7)
}) {
  // TODO: 地球目前实体未返回
  const CONFIG = {
    insideWireframe: opt.insideWireframe || false,
    outsideWireframe: opt.outsideWireframe || false,
    insideVisible: opt.insideVisible && true,
    outsideVisible: opt.outsideVisible && true,
    innerGlowColor: opt.innerGlowColor || new THREE.Vector3(1.0, 1.0, 1.0)
  };

  // 地球双层的内层
  let Earth_Inside_Geometry = new THREE.SphereGeometry(200, 40, 30);

  let Earth_Inside_Material = new THREE.ShaderMaterial({
    uniforms: {
      texture: { type: 't', value: new THREE.TextureLoader().load('images/map_2048_1024.jpg') },
      innerGlowColor: { type: 'v3', value: CONFIG.innerGlowColor }
    },
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    wireframe: CONFIG.insideWireframe,
    visible: CONFIG.insideVisible
  });

  let Earth_Inside = new THREE.Mesh(Earth_Inside_Geometry, Earth_Inside_Material);
  Earth_Inside.rotation.y = Math.PI;
  scene.add(Earth_Inside);

  // 地球双层的外层
  let Earth_Outside_Geometry = new THREE.SphereGeometry(205, 30, 30);
  let Earth_Outside_Material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('images/map_earth_lights.jpg'),
    alphaMap: new THREE.TextureLoader().load('images/map_4096_2048_alpha.jpg'),
    transparent: true,
    depthWrite: false,
    color: 0x3c63b3,
    wireframe: CONFIG.outsideWireframe,
    visible: CONFIG.outsideVisible
  });
  let Earth_Outside = new THREE.Mesh(Earth_Outside_Geometry, Earth_Outside_Material);
  Earth_Outside.rotation.y = Math.PI;

  console.log(Earth_Outside);
  scene.add(Earth_Outside);
}

module.exports = {
  Init: earthInit
};
