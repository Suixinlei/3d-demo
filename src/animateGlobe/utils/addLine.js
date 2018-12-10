import * as BABYLON from 'babylonjs';
import {countries} from '../globePoints';
import returnCurveCoordinates from './returnCurveCoordinates';

var _vs =
  `attribute vec3 position;

uniform mat4 worldViewProjection;
uniform float time;

varying vec3 vPosition;
varying vec2 vUV;

void main() {
    vec4 p = vec4( position, 1. );
    vPosition = p.xyz;
	gl_Position = worldViewProjection * p;
}`;

var _fs =
  `
uniform float time;
uniform vec2 resolution;

varying vec3 vPosition;
varying vec2 vUV;

const float PI = 3.15;

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

vec3 BlueSpecial(float t, float s){
    vec3 color;
    float wavval =  0.05 * ((sin(t * 0.0575) + 1.0) / 2.0) + 0.60;
    color = hsv(wavval , 0.88, s);
    return color;
}

vec3 MagentaSpecial(float t, float s){
    vec3 color;
    float wavval =  0.05 * ((sin(t * 0.0575) + 1.0) / 2.0) + 0.90;
    color = hsv(wavval , 0.88, s);
    return color;
}

void main(){
    vec2 p = (vPosition.xy * 2.0 - resolution) / resolution;
    vec3 line = vec3(0.0);

    for(float fi = 0.0; fi < 5.0; ++fi){
        float offset = fi * PI / 100.0;        
        float value = 3.0 - sin(time * fi * 0.15 + 0.1) * 1.5;
        float timer = time * fi * 0.08;
        line += 0.0025 / abs(p.y + sin(p.x * 1.0 + timer + offset) * 0.75) * BlueSpecial(fi + time ,value);
        line += 0.0025 / abs(p.y + cos(1.0 - p.x * 1.0 + timer + offset) * 0.75) * MagentaSpecial(fi + time ,value);        
    }

    gl_FragColor = vec4(line, 1.0);
}
`;

const _fs2 =
  `
uniform float time;
uniform vec2 resolution;

varying vec3 vPosition;

float ntsf(float x,float k) {
	x = clamp(x,-1.0,1.0);
	return (x-x*k)/(k - abs(x) * 2.0 * k + 1.0);
}

void main( void ) {

	vec2 ps = ( vPosition.xy / resolution.xy );
	
	vec2 p = vec2(cos(time*0.1)*ps.x+sin(time*0.1)*ps.y,-sin(time*0.1)*ps.x+cos(time*0.1)*ps.y);
	
	
	float x = p.x * 0.3 + 3.5;
	float y = p.y * 0.3 + sin(time) + time/ 2.0;
	float d;
	
	float v0 = cos(sin(time/4.0)*x);
	float v1 = sin(2.0*time)/8.0*v0*v0;
	float e = v1+(1.7+cos(time)/4.0)*sin(y)*sin(y)-1.0;
	
	float r = 1.0-ntsf(abs(e),cos(time*0.4)*0.9);
	float g = 1.0-ntsf(abs(e),cos(time*0.5)*0.5);
	float b = 1.0-ntsf(abs(e),cos(time*0.6)*0.3);
		
	gl_FragColor = vec4( vec3(r,g,b), 1.0 );
}
 `;
BABYLON.Effect.ShadersStore["basicVertexShader"] = _vs;
BABYLON.Effect.ShadersStore["basicFragmentShader"] = _fs2;


export default function addLine(scene, countryStart, countryEnd) {
  // Skip if the country is the same
  if (countryStart === countryEnd) {
    return;
  }

  // Get the spatial coordinates
  var result = returnCurveCoordinates(
    countries[countryStart].x,
    countries[countryStart].y,
    countries[countryEnd].x,
    countries[countryEnd].y
  );

  // Calcualte the curve in order to get points from
  const curve = BABYLON.Curve3.CreateQuadraticBezier(
    new BABYLON.Vector3(result.start.x, result.start.y, result.start.z),
    new BABYLON.Vector3(result.mid.x, result.mid.y, result.mid.z),
    new BABYLON.Vector3(result.end.x, result.end.y, result.end.z),
    200
  );

  // Create mesh line using plugin and set its geometry
  // const line = BABYLON.MeshBuilder.CreateLines(`${countryStart} + ${countryEnd}`, { points: curve.getPoints() }, this._scene);
  // line.enableEdgesRendering(0.999);
  // line.edgesColor = new BABYLON.Color4(1, 1, 1, 0.6);
  // line.edgesWidth = 100;
  // line.outlineColor = new BABYLON.Color3(1, 1, 1);
  // line.outlineWidth = 200;
  const defines = [
    'precision highp float',
  ];
  const shader = new BABYLON.ShaderMaterial(`${countryStart} + ${countryEnd}`, scene, {
    vertex: 'basic',
    fragment: 'basic',
  }, {
    attributes: ["position"],
    // defines: defines,
    uniforms: ['time', 'resolution', "worldViewProjection"]
  });
  shader.setVector2('resolution', new BABYLON.Vector2(1, 1));

  let time = 0;
  scene.registerBeforeRender(() => {
    //falseCam.update();
    time += 0.01;
    shader.setFloat('time', time);
  });

  // const lineMaterial = new BABYLON.StandardMaterial(`${countryStart} + ${countryEnd}`, scene);
  // lineMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
  // lineMaterial.emissiveColor = new BABYLON.Color3.Black();

  const ciclePoints = curve.getPoints();

  const paths = [];
  for (var i = 0; i < ciclePoints.length; i++) {
    paths.push([
      new BABYLON.Vector3(ciclePoints[i].x - 1, ciclePoints[i].y, ciclePoints[i].z),
      new BABYLON.Vector3(ciclePoints[i].x, ciclePoints[i].y, ciclePoints[i].z),
      new BABYLON.Vector3(ciclePoints[i].x + 1, ciclePoints[i].y, ciclePoints[i].z),
    ]);
  }

  const line = BABYLON.MeshBuilder.CreateRibbon(`${countryStart} + ${countryEnd}`, {
    pathArray: paths,
    closePath: true
  }, scene);
  line.material = shader;
  return line;
}
