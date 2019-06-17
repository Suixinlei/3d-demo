const tween = new TWEEN.Tween({ x: 0 }).to({ x: 2 }, 3000);
tween.easing(TWEEN.Easing.Sinusoidal.InOut);

let count = geometry.getAttribute('position').count;
tween.onUpdate(function () {
  let x = this.x;
  if (x > 1) {
    x = 2 - x;
  }
  const vertexs = new Float32Array( vertices.length * 3 )
  const positionArray = geometry.getAttribute('position').array;
  for (let i = 0; i < count; i++ ) {
    const target = vertices[i].clone().lerp(spreadVertices[i], x);
    target.toArray(vertexs, i * 3);
  }
  spherePoints.geometry.attributes.position.array = vertexs;
  spherePoints.geometry.attributes.position.needsUpdate = true;
})

tween.delay(2000);
// tween.start();