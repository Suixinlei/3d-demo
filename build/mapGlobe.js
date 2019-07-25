/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/mapGlobe/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/_stats.js@0.17.0@stats.js/build/stats.min.js":
/*!*******************************************************************!*\
  !*** ./node_modules/_stats.js@0.17.0@stats.js/build/stats.min.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n// stats.js - http://github.com/mrdoob/stats.js\n(function (f, e) {\n  \"object\" === ( false ? undefined : _typeof(exports)) && \"undefined\" !== typeof module ? module.exports = e() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (e),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :\n\t\t\t\t__WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : undefined;\n})(undefined, function () {\n  var f = function f() {\n    function e(a) {\n      c.appendChild(a.dom);return a;\n    }function u(a) {\n      for (var d = 0; d < c.children.length; d++) {\n        c.children[d].style.display = d === a ? \"block\" : \"none\";\n      }l = a;\n    }var l = 0,\n        c = document.createElement(\"div\");c.style.cssText = \"position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000\";c.addEventListener(\"click\", function (a) {\n      a.preventDefault();\n      u(++l % c.children.length);\n    }, !1);var k = (performance || Date).now(),\n        g = k,\n        a = 0,\n        r = e(new f.Panel(\"FPS\", \"#0ff\", \"#002\")),\n        h = e(new f.Panel(\"MS\", \"#0f0\", \"#020\"));if (self.performance && self.performance.memory) var t = e(new f.Panel(\"MB\", \"#f08\", \"#201\"));u(0);return { REVISION: 16, dom: c, addPanel: e, showPanel: u, begin: function begin() {\n        k = (performance || Date).now();\n      }, end: function end() {\n        a++;var c = (performance || Date).now();h.update(c - k, 200);if (c > g + 1E3 && (r.update(1E3 * a / (c - g), 100), g = c, a = 0, t)) {\n          var d = performance.memory;t.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);\n        }return c;\n      }, update: function update() {\n        k = this.end();\n      }, domElement: c, setMode: u };\n  };f.Panel = function (e, f, l) {\n    var c = Infinity,\n        k = 0,\n        g = Math.round,\n        a = g(window.devicePixelRatio || 1),\n        r = 80 * a,\n        h = 48 * a,\n        t = 3 * a,\n        v = 2 * a,\n        d = 3 * a,\n        m = 15 * a,\n        n = 74 * a,\n        p = 30 * a,\n        q = document.createElement(\"canvas\");q.width = r;q.height = h;q.style.cssText = \"width:80px;height:48px\";var b = q.getContext(\"2d\");b.font = \"bold \" + 9 * a + \"px Helvetica,Arial,sans-serif\";b.textBaseline = \"top\";b.fillStyle = l;b.fillRect(0, 0, r, h);b.fillStyle = f;b.fillText(e, t, v);\n    b.fillRect(d, m, n, p);b.fillStyle = l;b.globalAlpha = .9;b.fillRect(d, m, n, p);return { dom: q, update: function update(h, w) {\n        c = Math.min(c, h);k = Math.max(k, h);b.fillStyle = l;b.globalAlpha = 1;b.fillRect(0, 0, r, m);b.fillStyle = f;b.fillText(g(h) + \" \" + e + \" (\" + g(c) + \"-\" + g(k) + \")\", t, v);b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p);b.fillRect(d + n - a, m, a, p);b.fillStyle = l;b.globalAlpha = .9;b.fillRect(d + n - a, m, a, g((1 - h / w) * p));\n      } };\n  };return f;\n});\n\n//# sourceURL=webpack:///./node_modules/_stats.js@0.17.0@stats.js/build/stats.min.js?");

/***/ }),

/***/ "./src/mapGlobe/index.css":
/*!********************************!*\
  !*** ./src/mapGlobe/index.css ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/mapGlobe/index.css?");

/***/ }),

/***/ "./src/mapGlobe/index.js":
/*!*******************************!*\
  !*** ./src/mapGlobe/index.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar THREE = __webpack_require__(/*! three */ \"three\");\nvar Stats = __webpack_require__(/*! stats.js */ \"./node_modules/_stats.js@0.17.0@stats.js/build/stats.min.js\");\nvar TWEEN = __webpack_require__(/*! tween */ \"tween\");\nvar mapboxgl = __webpack_require__(/*! mapboxgl */ \"mapboxgl\");\n\n__webpack_require__(/*! ./index.css */ \"./src/mapGlobe/index.css\");\n\nmapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaHVhc3VpIiwiYSI6ImNqd2ltd3kzZTJxN2k0NWtkcjI5dTZ4d3UifQ.9qU_lGxNxWBIaSOvt3hO0w';\n\nvar zoom = 5;\nvar mapWidth = 1200 * zoom;\nvar mapHeight = 1200 * zoom;\nvar DEBUG = location.hash == '#DEBUG';\n\nvar $map = document.getElementById('map');\nvar $eMap = document.getElementById('equirectangular-map');\nvar $loader = document.getElementById('loader');\n\n$map.style.width = mapWidth + 'px';\n$map.style.height = mapHeight + 'px';\n\nvar dpr = window.devicePixelRatio;\nvar width = mapWidth * dpr;\nvar height = mapHeight * dpr;\nvar halfHeight = height / 2;\n\n$eMap.width = width;\n$eMap.height = halfHeight;\n\n// 3D stuff\nvar container = document.getElementById('container');\nvar renderer = new THREE.WebGLRenderer({\n  alpha: true,\n  antialias: true,\n  stencil: false\n});\nrenderer.setPixelRatio(dpr);\nrenderer.setSize(window.innerWidth, window.innerHeight);\n// Fix \"GL_ARB_gpu_shader5\" bug: https://github.com/mrdoob/three.js/issues/9716\nrenderer.context.getShaderInfoLog = function () {\n  return '';\n};\ncontainer.appendChild(renderer.domElement);\n\n// Camera\nvar camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 2000);\ncamera.position.z = 800;\nvar controls = new THREE.OrbitControls(camera, renderer.domElement);\ncontrols.addEventListener('change', render);\ncontrols.minDistance = 500;\ncontrols.maxDistance = 1000;\ncontrols.enablePan = false;\n// controls.maxPolarAngle = Math.PI / 3;\n// controls.minPolarAngle = Math.PI / 3;\n\ncontrols.update();\n\n// Scene\nvar scene = new THREE.Scene();\nscene.background = new THREE.Color(0x000000);\n\n// Earth\nvar texture = new THREE.CanvasTexture($eMap);\ntexture.minFilter = THREE.LinearFilter; // Fix \"Textures should be of a power of two\" warning\nvar geometry = new THREE.SphereGeometry(512, 64, 64);\nvar material = new THREE.MeshBasicMaterial();\nvar earth = new THREE.Mesh(geometry, material);\nscene.add(earth);\n\n// Light\nvar light = new THREE.DirectionalLight(0xffffff);\nlight.target = earth;\nscene.add(light);\n\nif (DEBUG) {\n  var stats = new Stats();\n  container.appendChild(stats.domElement);\n}\n\n// Stop auto-rotating earth when dragging it\nvar stopRotating = false;\ncontainer.ontouchstart = container.onmousedown = function () {\n  stopRotating = true;\n};\ncontainer.ontouchend = container.ontouchcancel = container.onmouseup = function () {\n  stopRotating = false;\n};\n\nwindow.onresize = function () {\n  camera.aspect = window.innerWidth / window.innerHeight;\n  camera.updateProjectionMatrix();\n  renderer.setSize(window.innerWidth, window.innerHeight);\n};\n\n// Projections stuff\nvar equirectangular = d3.geoEquirectangular().scale(width / 2 / Math.PI).translate([width / 2, height * .75]);\nvar mercator = d3.geoMercator().scale(width / 2 / Math.PI).translate([width / 2, height / 2]);\nvar invert = equirectangular.invert;\n\nvar context = $eMap.getContext('2d', { alpha: false });\n\n$loader.hidden = false;\n\nvar map = new mapboxgl.Map({\n  container: 'map',\n  // optimize=true -> https://blog.mapbox.com/style-optimized-vector-tiles-39868da81275\n  // style: 'mapbox://styles/mapbox/' + style + '-v9?optimize=true',\n  style: 'mapbox://styles/mapbox/streets-v11',\n  center: [0, 0],\n  zoom: zoom,\n  // interactive: false,\n  // renderWorldCopies: false,\n  attributionControl: false,\n  // trackResize: false,\n  preserveDrawingBuffer: true\n});\n\nmap.on('load', function () {\n  var canvas = map.getCanvas();\n  var gl = canvas.getContext('webgl', { alpha: false, antialias: false });\n\n  console.log('Map loaded');\n\n  setTimeout(function () {\n    console.log('Render map start');\n    var source = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);\n    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, source);\n    var sourceData = new Uint8ClampedArray(source.buffer);\n    var targetData = new Uint8ClampedArray(sourceData.length / 2).fill(255);\n\n    // This part is really slow >:(\n    console.time('Reprojection');\n    var w = width;\n    var h = height;\n    var x = 0;\n    var y;\n    for (; x < w; x++) {\n      for (y = 0; y < h; y++) {\n        var pixels = mercator(invert([x, y]));\n        if (!isNaN(pixels[1])) {\n          var sourceIndex = 4 * (~~pixels[0] + w * ~~pixels[1]);\n          // Would have been x + w + h if it's not WebGL context\n          // (h-y-1) is to flip the Y (vertical) because WebGL texture starts at the bottom\n          var targetIndex = 4 * (x + w * (h - y - 1));\n          targetData[targetIndex] = sourceData[sourceIndex];\n          targetData[targetIndex + 1] = sourceData[sourceIndex + 1];\n          targetData[targetIndex + 2] = sourceData[sourceIndex + 2];\n          // targetData[targetIndex + 3] = 255; // Already filled\n        }\n      }\n    }\n    console.timeEnd('Reprojection');\n\n    // $eMap.width = $eMap.width;\n    var target = context.createImageData(width, halfHeight);\n    target.data.set(targetData);\n\n    // Draw the equirectangular projection canvas\n    context.clearRect(0, 0, $eMap.width, $eMap.height);\n    context.putImageData(target, 0, 0);\n\n    // Cover the North pole\n    for (var y = 0; y < halfHeight; y++) {\n      var index = y * w * 4;\n      var firstColor = targetData[index];\n      if (firstColor !== 0) {\n        var color = 'rgb(' + targetData[index] + ',' + targetData[index + 1] + ',' + targetData[index + 2] + ')';\n        context.fillStyle = color;\n        context.fillRect(0, 0, w, y);\n        break;\n      }\n    }\n\n    // Cover the South pole\n    for (var y = halfHeight - 1; y >= 0; --y) {\n      var index = y * w * 4;\n      var firstColor = targetData[index];\n      if (firstColor !== 0) {\n        var color = 'rgb(' + targetData[index] + ',' + targetData[index + 1] + ',' + targetData[index + 2] + ')';\n        context.fillStyle = color;\n        context.fillRect(0, y + 1, w, halfHeight - y);\n        break;\n      }\n    }\n\n    console.log('Render map end');\n\n    $loader.hidden = true;\n\n    // Set texture on first load\n    if (!material.map) {\n      material.map = texture;\n      material.needsUpdate = true;\n      animate();\n    }\n    // Update texture\n    texture.needsUpdate = true;\n\n    // map.remove();\n  }, 350); // Delay for the tiles to render properly\n});\n\n// Debugging\nif (DEBUG) {\n  document.body.className = 'DEBUG';\n}\n\nvar clock = new THREE.Clock();\nfunction render() {\n  if (!stopRotating) {\n    var y = .001;\n    earth.rotation.y += y;\n  }\n  light.position.copy(camera.position);\n  renderer.render(scene, camera);\n}\n\nfunction animate() {\n  requestAnimationFrame(animate);\n  render();\n  if (DEBUG) stats.update();\n}\n\n//# sourceURL=webpack:///./src/mapGlobe/index.js?");

/***/ }),

/***/ "mapboxgl":
/*!***************************!*\
  !*** external "mapboxgl" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = mapboxgl;\n\n//# sourceURL=webpack:///external_%22mapboxgl%22?");

/***/ }),

/***/ "three":
/*!************************!*\
  !*** external "THREE" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = THREE;\n\n//# sourceURL=webpack:///external_%22THREE%22?");

/***/ }),

/***/ "tween":
/*!************************!*\
  !*** external "TWEEN" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = TWEEN;\n\n//# sourceURL=webpack:///external_%22TWEEN%22?");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQSIsImZpbGUiOiJtYXBHbG9iZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2J1aWxkL1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9tYXBHbG9iZS9pbmRleC5qc1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=