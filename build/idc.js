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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/idc/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/_decode-uri-component@0.2.0@decode-uri-component/index.js":
/*!********************************************************************************!*\
  !*** ./node_modules/_decode-uri-component@0.2.0@decode-uri-component/index.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar token = '%[a-f0-9]{2}';\nvar singleMatcher = new RegExp(token, 'gi');\nvar multiMatcher = new RegExp('(' + token + ')+', 'gi');\n\nfunction decodeComponents(components, split) {\n\ttry {\n\t\t// Try to decode the entire string first\n\t\treturn decodeURIComponent(components.join(''));\n\t} catch (err) {\n\t\t// Do nothing\n\t}\n\n\tif (components.length === 1) {\n\t\treturn components;\n\t}\n\n\tsplit = split || 1;\n\n\t// Split the array in 2 parts\n\tvar left = components.slice(0, split);\n\tvar right = components.slice(split);\n\n\treturn Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));\n}\n\nfunction decode(input) {\n\ttry {\n\t\treturn decodeURIComponent(input);\n\t} catch (err) {\n\t\tvar tokens = input.match(singleMatcher);\n\n\t\tfor (var i = 1; i < tokens.length; i++) {\n\t\t\tinput = decodeComponents(tokens, i).join('');\n\n\t\t\ttokens = input.match(singleMatcher);\n\t\t}\n\n\t\treturn input;\n\t}\n}\n\nfunction customDecodeURIComponent(input) {\n\t// Keep track of all the replacements and prefill the map with the `BOM`\n\tvar replaceMap = {\n\t\t'%FE%FF': '\\uFFFD\\uFFFD',\n\t\t'%FF%FE': '\\uFFFD\\uFFFD'\n\t};\n\n\tvar match = multiMatcher.exec(input);\n\twhile (match) {\n\t\ttry {\n\t\t\t// Decode as big chunks as possible\n\t\t\treplaceMap[match[0]] = decodeURIComponent(match[0]);\n\t\t} catch (err) {\n\t\t\tvar result = decode(match[0]);\n\n\t\t\tif (result !== match[0]) {\n\t\t\t\treplaceMap[match[0]] = result;\n\t\t\t}\n\t\t}\n\n\t\tmatch = multiMatcher.exec(input);\n\t}\n\n\t// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else\n\treplaceMap['%C2'] = '\\uFFFD';\n\n\tvar entries = Object.keys(replaceMap);\n\n\tfor (var i = 0; i < entries.length; i++) {\n\t\t// Replace all decoded components\n\t\tvar key = entries[i];\n\t\tinput = input.replace(new RegExp(key, 'g'), replaceMap[key]);\n\t}\n\n\treturn input;\n}\n\nmodule.exports = function (encodedURI) {\n\tif (typeof encodedURI !== 'string') {\n\t\tthrow new TypeError('Expected `encodedURI` to be of type `string`, got `' + (typeof encodedURI === 'undefined' ? 'undefined' : _typeof(encodedURI)) + '`');\n\t}\n\n\ttry {\n\t\tencodedURI = encodedURI.replace(/\\+/g, ' ');\n\n\t\t// Try the built in decoder first\n\t\treturn decodeURIComponent(encodedURI);\n\t} catch (err) {\n\t\t// Fallback to a more advanced decoder\n\t\treturn customDecodeURIComponent(encodedURI);\n\t}\n};\n\n//# sourceURL=webpack:///./node_modules/_decode-uri-component@0.2.0@decode-uri-component/index.js?");

/***/ }),

/***/ "./node_modules/_query-string@6.2.0@query-string/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/_query-string@6.2.0@query-string/index.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"]) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); } }; }();\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar strictUriEncode = __webpack_require__(/*! strict-uri-encode */ \"./node_modules/_strict-uri-encode@2.0.0@strict-uri-encode/index.js\");\nvar decodeComponent = __webpack_require__(/*! decode-uri-component */ \"./node_modules/_decode-uri-component@0.2.0@decode-uri-component/index.js\");\n\nfunction encoderForArrayFormat(options) {\n\tswitch (options.arrayFormat) {\n\t\tcase 'index':\n\t\t\treturn function (key, value, index) {\n\t\t\t\treturn value === null ? [encode(key, options), '[', index, ']'].join('') : [encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('');\n\t\t\t};\n\t\tcase 'bracket':\n\t\t\treturn function (key, value) {\n\t\t\t\treturn value === null ? [encode(key, options), '[]'].join('') : [encode(key, options), '[]=', encode(value, options)].join('');\n\t\t\t};\n\t\tdefault:\n\t\t\treturn function (key, value) {\n\t\t\t\treturn value === null ? encode(key, options) : [encode(key, options), '=', encode(value, options)].join('');\n\t\t\t};\n\t}\n}\n\nfunction parserForArrayFormat(options) {\n\tvar result = void 0;\n\n\tswitch (options.arrayFormat) {\n\t\tcase 'index':\n\t\t\treturn function (key, value, accumulator) {\n\t\t\t\tresult = /\\[(\\d*)\\]$/.exec(key);\n\n\t\t\t\tkey = key.replace(/\\[\\d*\\]$/, '');\n\n\t\t\t\tif (!result) {\n\t\t\t\t\taccumulator[key] = value;\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tif (accumulator[key] === undefined) {\n\t\t\t\t\taccumulator[key] = {};\n\t\t\t\t}\n\n\t\t\t\taccumulator[key][result[1]] = value;\n\t\t\t};\n\t\tcase 'bracket':\n\t\t\treturn function (key, value, accumulator) {\n\t\t\t\tresult = /(\\[\\])$/.exec(key);\n\t\t\t\tkey = key.replace(/\\[\\]$/, '');\n\n\t\t\t\tif (!result) {\n\t\t\t\t\taccumulator[key] = value;\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tif (accumulator[key] === undefined) {\n\t\t\t\t\taccumulator[key] = [value];\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\taccumulator[key] = [].concat(accumulator[key], value);\n\t\t\t};\n\t\tdefault:\n\t\t\treturn function (key, value, accumulator) {\n\t\t\t\tif (accumulator[key] === undefined) {\n\t\t\t\t\taccumulator[key] = value;\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\taccumulator[key] = [].concat(accumulator[key], value);\n\t\t\t};\n\t}\n}\n\nfunction encode(value, options) {\n\tif (options.encode) {\n\t\treturn options.strict ? strictUriEncode(value) : encodeURIComponent(value);\n\t}\n\n\treturn value;\n}\n\nfunction decode(value, options) {\n\tif (options.decode) {\n\t\treturn decodeComponent(value);\n\t}\n\n\treturn value;\n}\n\nfunction keysSorter(input) {\n\tif (Array.isArray(input)) {\n\t\treturn input.sort();\n\t}\n\n\tif ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {\n\t\treturn keysSorter(Object.keys(input)).sort(function (a, b) {\n\t\t\treturn Number(a) - Number(b);\n\t\t}).map(function (key) {\n\t\t\treturn input[key];\n\t\t});\n\t}\n\n\treturn input;\n}\n\nfunction extract(input) {\n\tvar queryStart = input.indexOf('?');\n\tif (queryStart === -1) {\n\t\treturn '';\n\t}\n\n\treturn input.slice(queryStart + 1);\n}\n\nfunction parse(input, options) {\n\toptions = Object.assign({ decode: true, arrayFormat: 'none' }, options);\n\n\tvar formatter = parserForArrayFormat(options);\n\n\t// Create an object with no prototype\n\tvar ret = Object.create(null);\n\n\tif (typeof input !== 'string') {\n\t\treturn ret;\n\t}\n\n\tinput = input.trim().replace(/^[?#&]/, '');\n\n\tif (!input) {\n\t\treturn ret;\n\t}\n\n\tvar _iteratorNormalCompletion = true;\n\tvar _didIteratorError = false;\n\tvar _iteratorError = undefined;\n\n\ttry {\n\t\tfor (var _iterator = input.split('&')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n\t\t\tvar param = _step.value;\n\n\t\t\tvar _param$replace$split = param.replace(/\\+/g, ' ').split('='),\n\t\t\t    _param$replace$split2 = _slicedToArray(_param$replace$split, 2),\n\t\t\t    key = _param$replace$split2[0],\n\t\t\t    value = _param$replace$split2[1];\n\n\t\t\t// Missing `=` should be `null`:\n\t\t\t// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters\n\n\n\t\t\tvalue = value === undefined ? null : decode(value, options);\n\n\t\t\tformatter(decode(key, options), value, ret);\n\t\t}\n\t} catch (err) {\n\t\t_didIteratorError = true;\n\t\t_iteratorError = err;\n\t} finally {\n\t\ttry {\n\t\t\tif (!_iteratorNormalCompletion && _iterator.return) {\n\t\t\t\t_iterator.return();\n\t\t\t}\n\t\t} finally {\n\t\t\tif (_didIteratorError) {\n\t\t\t\tthrow _iteratorError;\n\t\t\t}\n\t\t}\n\t}\n\n\treturn Object.keys(ret).sort().reduce(function (result, key) {\n\t\tvar value = ret[key];\n\t\tif (Boolean(value) && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Array.isArray(value)) {\n\t\t\t// Sort object keys, not values\n\t\t\tresult[key] = keysSorter(value);\n\t\t} else {\n\t\t\tresult[key] = value;\n\t\t}\n\n\t\treturn result;\n\t}, Object.create(null));\n}\n\nexports.extract = extract;\nexports.parse = parse;\n\nexports.stringify = function (obj, options) {\n\tif (!obj) {\n\t\treturn '';\n\t}\n\n\toptions = Object.assign({\n\t\tencode: true,\n\t\tstrict: true,\n\t\tarrayFormat: 'none'\n\t}, options);\n\n\tvar formatter = encoderForArrayFormat(options);\n\tvar keys = Object.keys(obj);\n\n\tif (options.sort !== false) {\n\t\tkeys.sort(options.sort);\n\t}\n\n\treturn keys.map(function (key) {\n\t\tvar value = obj[key];\n\n\t\tif (value === undefined) {\n\t\t\treturn '';\n\t\t}\n\n\t\tif (value === null) {\n\t\t\treturn encode(key, options);\n\t\t}\n\n\t\tif (Array.isArray(value)) {\n\t\t\tvar result = [];\n\n\t\t\tvar _iteratorNormalCompletion2 = true;\n\t\t\tvar _didIteratorError2 = false;\n\t\t\tvar _iteratorError2 = undefined;\n\n\t\t\ttry {\n\t\t\t\tfor (var _iterator2 = value.slice()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {\n\t\t\t\t\tvar value2 = _step2.value;\n\n\t\t\t\t\tif (value2 === undefined) {\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\t}\n\n\t\t\t\t\tresult.push(formatter(key, value2, result.length));\n\t\t\t\t}\n\t\t\t} catch (err) {\n\t\t\t\t_didIteratorError2 = true;\n\t\t\t\t_iteratorError2 = err;\n\t\t\t} finally {\n\t\t\t\ttry {\n\t\t\t\t\tif (!_iteratorNormalCompletion2 && _iterator2.return) {\n\t\t\t\t\t\t_iterator2.return();\n\t\t\t\t\t}\n\t\t\t\t} finally {\n\t\t\t\t\tif (_didIteratorError2) {\n\t\t\t\t\t\tthrow _iteratorError2;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\n\t\t\treturn result.join('&');\n\t\t}\n\n\t\treturn encode(key, options) + '=' + encode(value, options);\n\t}).filter(function (x) {\n\t\treturn x.length > 0;\n\t}).join('&');\n};\n\nexports.parseUrl = function (input, options) {\n\tvar hashStart = input.indexOf('#');\n\tif (hashStart !== -1) {\n\t\tinput = input.slice(0, hashStart);\n\t}\n\n\treturn {\n\t\turl: input.split('?')[0] || '',\n\t\tquery: parse(extract(input), options)\n\t};\n};\n\n//# sourceURL=webpack:///./node_modules/_query-string@6.2.0@query-string/index.js?");

/***/ }),

/***/ "./node_modules/_strict-uri-encode@2.0.0@strict-uri-encode/index.js":
/*!**************************************************************************!*\
  !*** ./node_modules/_strict-uri-encode@2.0.0@strict-uri-encode/index.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = function (str) {\n  return encodeURIComponent(str).replace(/[!'()*]/g, function (x) {\n    return '%' + x.charCodeAt(0).toString(16).toUpperCase();\n  });\n};\n\n//# sourceURL=webpack:///./node_modules/_strict-uri-encode@2.0.0@strict-uri-encode/index.js?");

/***/ }),

/***/ "./src/idc/app.ts":
/*!************************!*\
  !*** ./src/idc/app.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar BABYLON = __webpack_require__(/*! babylonjs */ \"babylonjs\");\nvar queryString = __webpack_require__(/*! query-string */ \"./node_modules/_query-string@6.2.0@query-string/index.js\");\nvar worldAxis_1 = __webpack_require__(/*! ./utils/worldAxis */ \"./src/idc/utils/worldAxis.js\");\nvar App = (function () {\n    function App(canvasElement) {\n        this._canvas = document.getElementById(canvasElement);\n        this._engine = new BABYLON.Engine(this._canvas, true);\n        var query = queryString.parse(location.search);\n        this._idcName = query.name;\n    }\n    App.prototype.createScene = function () {\n        var _this = this;\n        this._scene = new BABYLON.Scene(this._engine);\n        this._camera = new BABYLON.ArcRotateCamera('camera1', 8.29, 1.09, 128, BABYLON.Vector3.Zero(), this._scene);\n        this._camera.lowerBetaLimit = 0.1;\n        this._camera.upperBetaLimit = (Math.PI / 2) * 0.9;\n        this._camera.lowerRadiusLimit = 30;\n        this._camera.upperRadiusLimit = 300;\n        this._camera.attachControl(this._canvas, false);\n        this._camera.useAutoRotationBehavior = true;\n        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene);\n        var skybox = BABYLON.Mesh.CreateBox('skybox', 5000.0, this._scene);\n        var skyboxMat = new BABYLON.StandardMaterial('skybox', this._scene);\n        skyboxMat.backFaceCulling = false;\n        skyboxMat.reflectionTexture = new BABYLON.CubeTexture(\"/public/textures/skybox\", this._scene);\n        skyboxMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;\n        skyboxMat.diffuseColor = new BABYLON.Color3(0, 0, 0);\n        skyboxMat.specularColor = new BABYLON.Color3(0, 0, 0);\n        skyboxMat.disableLighting = true;\n        skybox.material = skyboxMat;\n        skybox.infiniteDistance = true;\n        var idcBox = BABYLON.MeshBuilder.CreateBox('idcBox', {\n            width: 80,\n            depth: 80,\n            height: 120,\n        }, this._scene);\n        var idcBoxMat = new BABYLON.StandardMaterial('idcBox', this._scene);\n        idcBoxMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);\n        idcBoxMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);\n        idcBoxMat.emissiveColor = BABYLON.Color3.Red();\n        idcBox.material = idcBoxMat;\n        idcBox.position = new BABYLON.Vector3(0, -100, -270);\n        idcBox.actionManager = new BABYLON.ActionManager(this._scene);\n        idcBox.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, idcBox.material, \"emissiveColor\", idcBoxMat.emissiveColor));\n        idcBox.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, idcBox.material, \"emissiveColor\", BABYLON.Color3.White()));\n        idcBox.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, idcBox, \"scaling\", new BABYLON.Vector3(1, 1, 1), 150));\n        idcBox.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, idcBox, \"scaling\", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));\n        idcBox.actionManager.registerAction(new BABYLON.IncrementValueAction(BABYLON.ActionManager.OnEveryFrameTrigger, idcBox, \"rotation.y\", 0.01));\n        idcBox.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {\n            _this._camera.target = idcBox.position;\n            idcBox.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnDoublePickTrigger, function () {\n                _this.exitStatus = true;\n            }));\n        }));\n        worldAxis_1.default(this._scene, 16);\n    };\n    App.prototype.createAssetsManager = function () {\n        this._assetsManager = new BABYLON.AssetsManager(this._scene);\n        var idcTask = this._assetsManager.addMeshTask('idc', '', '/public/resource/tiny_city/', 'scene.gltf');\n        idcTask.onSuccess = function (task) {\n            for (var _i = 0, _a = task.loadedMeshes; _i < _a.length; _i++) {\n                var mesh = _a[_i];\n                mesh.scaling = new BABYLON.Vector3(20, 20, 20);\n            }\n        };\n        idcTask.onError = function (task, message, exception) {\n            console.log(task, message, exception);\n        };\n        this._assetsManager.load();\n    };\n    App.prototype.doRender = function () {\n        var _this = this;\n        this._scene.registerAfterRender(function () {\n            if (_this.exitStatus) {\n                _this._camera.radius -= 3;\n                console.log(_this._camera.radius);\n                if (_this._camera.radius < 50) {\n                    window.location.href = \"/room?name=\" + _this._idcName;\n                }\n            }\n        });\n        this._assetsManager.onFinish = function (tasks) {\n            _this._engine.runRenderLoop(function () {\n                _this._scene.render();\n            });\n        };\n        window.addEventListener('resize', function () {\n            _this._engine.resize();\n        });\n    };\n    return App;\n}());\nexports.default = App;\n\n\n//# sourceURL=webpack:///./src/idc/app.ts?");

/***/ }),

/***/ "./src/idc/index.css":
/*!***************************!*\
  !*** ./src/idc/index.css ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/idc/index.css?");

/***/ }),

/***/ "./src/idc/index.ts":
/*!**************************!*\
  !*** ./src/idc/index.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar app_1 = __webpack_require__(/*! ./app */ \"./src/idc/app.ts\");\n__webpack_require__(/*! ./index.css */ \"./src/idc/index.css\");\nwindow.addEventListener('DOMContentLoaded', function () {\n    var app = new app_1.default('renderCanvas');\n    app.createScene();\n    app.createAssetsManager();\n    app.doRender();\n});\n\n\n//# sourceURL=webpack:///./src/idc/index.ts?");

/***/ }),

/***/ "./src/idc/utils/worldAxis.js":
/*!************************************!*\
  !*** ./src/idc/utils/worldAxis.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\n/*********************************Start World Axes********************/\nvar showAxis = function showAxis(scene, size) {\n  var makeTextPlane = function makeTextPlane(text, color, size) {\n    var dynamicTexture = new BABYLON.DynamicTexture(\"DynamicTexture\", 50, scene, true);\n    dynamicTexture.hasAlpha = true;\n    dynamicTexture.drawText(text, 5, 40, \"bold 36px Arial\", color, \"transparent\", true);\n    var plane = new BABYLON.Mesh.CreatePlane(\"TextPlane\", size, scene, true);\n    plane.material = new BABYLON.StandardMaterial(\"TextPlaneMaterial\", scene);\n    plane.material.backFaceCulling = false;\n    plane.material.specularColor = new BABYLON.Color3(0, 0, 0);\n    plane.material.diffuseTexture = dynamicTexture;\n    return plane;\n  };\n\n  var axisX = BABYLON.Mesh.CreateLines(\"axisX\", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)], scene);\n  axisX.color = new BABYLON.Color3(1, 0, 0);\n  var xChar = makeTextPlane(\"X\", \"red\", size / 10);\n  xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);\n  var axisY = BABYLON.Mesh.CreateLines(\"axisY\", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)], scene);\n  axisY.color = new BABYLON.Color3(0, 1, 0);\n  var yChar = makeTextPlane(\"Y\", \"green\", size / 10);\n  yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);\n  var axisZ = BABYLON.Mesh.CreateLines(\"axisZ\", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)], scene);\n  axisZ.color = new BABYLON.Color3(0, 0, 1);\n  var zChar = makeTextPlane(\"Z\", \"blue\", size / 10);\n  zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);\n};\n/***************************End World Axes***************************/\n\nexports.default = showAxis;\n\n//# sourceURL=webpack:///./src/idc/utils/worldAxis.js?");

/***/ }),

/***/ "babylonjs":
/*!**************************!*\
  !*** external "BABYLON" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = BABYLON;\n\n//# sourceURL=webpack:///external_%22BABYLON%22?");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQSIsImZpbGUiOiJpZGMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9idWlsZC9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaWRjL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==