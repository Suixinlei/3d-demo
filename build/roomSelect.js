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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/roomSelect/index.ts");
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

/***/ "./src/roomSelect/app.ts":
/*!*******************************!*\
  !*** ./src/roomSelect/app.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar BABYLON = __webpack_require__(/*! babylonjs */ \"babylonjs\");\nvar queryString = __webpack_require__(/*! query-string */ \"./node_modules/_query-string@6.2.0@query-string/index.js\");\nvar worldAxis_1 = __webpack_require__(/*! ./utils/worldAxis */ \"./src/roomSelect/utils/worldAxis.js\");\nvar createLabel_1 = __webpack_require__(/*! ./utils/createLabel */ \"./src/roomSelect/utils/createLabel.js\");\nvar parsedQuery = queryString.parse(location.search);\nvar App = (function () {\n    function App(canvasElement) {\n        this._canvas = document.getElementById(canvasElement);\n        this._engine = new BABYLON.Engine(this._canvas, true);\n        var query = queryString.parse(location.search);\n        this._idcName = query.name;\n    }\n    App.prototype.createScene = function () {\n        var _this = this;\n        this._scene = new BABYLON.Scene(this._engine);\n        this._camera = new BABYLON.ArcRotateCamera('camera1', 8.081757598903184, 0.7679233782762465, 500, BABYLON.Vector3.Zero(), this._scene);\n        this._camera.lowerRadiusLimit = 300;\n        this._camera.upperRadiusLimit = 800;\n        this._camera.attachControl(this._canvas, false);\n        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene);\n        var light2 = new BABYLON.DirectionalLight('direction', new BABYLON.Vector3(100, -300, -100), this._scene);\n        var wallHeight = 30;\n        var wallWidth = 800;\n        var wallDepth = 300;\n        var wallThickness = 10;\n        var ground = BABYLON.MeshBuilder.CreateGround('ground', { width: wallWidth, height: wallDepth }, this._scene);\n        var groundMat = new BABYLON.StandardMaterial('mat1', this._scene);\n        groundMat.diffuseColor = BABYLON.Color3.White();\n        groundMat.alpha = 0.8;\n        ground.material = groundMat;\n        var wall1 = BABYLON.MeshBuilder.CreateBox('wall1', { width: wallWidth, height: wallHeight, depth: wallThickness }, this._scene);\n        wall1.position = new BABYLON.Vector3(0, wallHeight / 2, -wallDepth / 2);\n        var wall2 = wall1.clone();\n        wall2.position = new BABYLON.Vector3(0, wallHeight / 2, wallDepth / 2);\n        var wall3 = BABYLON.MeshBuilder.CreateBox('wall1', { width: wallThickness, height: wallHeight, depth: wallDepth }, this._scene);\n        wall3.position = new BABYLON.Vector3(wallWidth / 2, wallHeight / 2, 0);\n        var wall4 = wall3.clone();\n        wall4.position = new BABYLON.Vector3(-wallWidth / 2, wallHeight / 2, 0);\n        var wall5 = wall3.clone();\n        wall5.position = new BABYLON.Vector3(wallWidth / 4, wallHeight / 2, 0);\n        var wall6 = wall3.clone();\n        wall6.position = new BABYLON.Vector3(0, wallHeight / 2, 0);\n        var wall7 = wall3.clone();\n        wall7.position = new BABYLON.Vector3(-wallWidth / 4, wallHeight / 2, 0);\n        var wall8 = wall1.clone();\n        wall8.position = new BABYLON.Vector3(0, wallHeight / 2, 0);\n        var labelList = [];\n        var positionArray = [\n            new BABYLON.Vector3(wallWidth / 8 * 3, wallHeight, -wallDepth / 4),\n            new BABYLON.Vector3(wallWidth / 8 * 3, wallHeight, wallDepth / 4),\n            new BABYLON.Vector3(wallWidth / 8, wallHeight, -wallDepth / 4),\n            new BABYLON.Vector3(wallWidth / 8, wallHeight, wallDepth / 4),\n            new BABYLON.Vector3(-wallWidth / 8, wallHeight, -wallDepth / 4),\n            new BABYLON.Vector3(-wallWidth / 8, wallHeight, wallDepth / 4),\n            new BABYLON.Vector3(-wallWidth / 8 * 3, wallHeight, -wallDepth / 4),\n            new BABYLON.Vector3(-wallWidth / 8 * 3, wallHeight, wallDepth / 4),\n        ];\n        var _loop_1 = function (i) {\n            labelList.push(createLabel_1.default(this_1._scene, \"\" + parsedQuery.building + parsedQuery.level + \"-\" + (i + 1), positionArray[i], function () {\n                window.location.href = \"/room?name=\" + parsedQuery.name + \"&building=\" + parsedQuery.building + \"&level=\" + parsedQuery.level + \"&roomNo=\" + (i + 1);\n            }));\n        };\n        var this_1 = this;\n        for (var i = 0; i < 8; i++) {\n            _loop_1(i);\n        }\n        this._scene.registerAfterRender(function () {\n            for (var _i = 0, labelList_1 = labelList; _i < labelList_1.length; _i++) {\n                var label = labelList_1[_i];\n                label.lookAt(_this._camera.position);\n            }\n        });\n        if (true) {\n            worldAxis_1.default(this._scene, 128);\n        }\n    };\n    App.prototype.doRender = function () {\n        var _this = this;\n        this._scene.registerAfterRender(function () {\n        });\n        this._engine.runRenderLoop(function () {\n            _this._scene.render();\n        });\n        window.addEventListener('resize', function () {\n            _this._engine.resize();\n        });\n    };\n    return App;\n}());\nexports.default = App;\n\n\n//# sourceURL=webpack:///./src/roomSelect/app.ts?");

/***/ }),

/***/ "./src/roomSelect/index.css":
/*!**********************************!*\
  !*** ./src/roomSelect/index.css ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/roomSelect/index.css?");

/***/ }),

/***/ "./src/roomSelect/index.ts":
/*!*********************************!*\
  !*** ./src/roomSelect/index.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar app_1 = __webpack_require__(/*! ./app */ \"./src/roomSelect/app.ts\");\n__webpack_require__(/*! ./index.css */ \"./src/roomSelect/index.css\");\nwindow.addEventListener('DOMContentLoaded', function () {\n    var app = new app_1.default('renderCanvas');\n    app.createScene();\n    app.doRender();\n});\n\n\n//# sourceURL=webpack:///./src/roomSelect/index.ts?");

/***/ }),

/***/ "./src/roomSelect/utils/createLabel.js":
/*!*********************************************!*\
  !*** ./src/roomSelect/utils/createLabel.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nfunction createLabel(scene, name, position, clickCallback) {\n  var labelWidth = 40;\n  var labelHeight = 10;\n  var label = BABYLON.MeshBuilder.CreatePlane(name, { width: labelWidth, height: labelHeight, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);\n  label.position = position.clone();\n\n  var labelTexture = new BABYLON.DynamicTexture('dynamic', { width: labelWidth * 6, height: labelHeight * 6 }, scene, false);\n  var labelMat = new BABYLON.StandardMaterial(name, scene);\n  labelMat.diffuseTexture = labelTexture;\n  label.material = labelMat;\n\n  var fontSize = 12;\n  var ctx = labelTexture.getContext();\n  ctx.font = fontSize + 'px monospace';\n  var textWidth = ctx.measureText(name).width;\n  var ratio = textWidth / fontSize;\n  var fontRealSize = Math.floor(labelWidth * 6 / ratio);\n  labelTexture.drawText(name, null, null, fontRealSize + 'px monospace', 'black', 'transparent', true, true);\n  label.renderOutline = true;\n  label.outlineWidth = 0.1;\n  labelTexture.hasAlpha = true;\n\n  // MouseOver\n  var makeOverOut = function makeOverOut(mesh) {\n    mesh.actionManager = new BABYLON.ActionManager(scene);\n    mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh.material, \"diffuseColor\", mesh.material.emissiveColor));\n    mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, \"diffuseColor\", BABYLON.Color3.White()));\n    mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, \"scaling\", new BABYLON.Vector3(1, 1, 1), 150));\n    mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, \"scaling\", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));\n    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({\n      trigger: BABYLON.ActionManager.OnPickDownTrigger\n      // parameter: 'r',\n    }, clickCallback));\n  };\n  makeOverOut(label);\n\n  return label;\n}\n\nexports.default = createLabel;\n\n//# sourceURL=webpack:///./src/roomSelect/utils/createLabel.js?");

/***/ }),

/***/ "./src/roomSelect/utils/worldAxis.js":
/*!*******************************************!*\
  !*** ./src/roomSelect/utils/worldAxis.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\n/*********************************Start World Axes********************/\nvar showAxis = function showAxis(scene, size) {\n  var makeTextPlane = function makeTextPlane(text, color, size) {\n    var dynamicTexture = new BABYLON.DynamicTexture(\"DynamicTexture\", 50, scene, true);\n    dynamicTexture.hasAlpha = true;\n    dynamicTexture.drawText(text, 5, 40, \"bold 36px Arial\", color, \"transparent\", true);\n    var plane = new BABYLON.Mesh.CreatePlane(\"TextPlane\", size, scene, true);\n    plane.material = new BABYLON.StandardMaterial(\"TextPlaneMaterial\", scene);\n    plane.material.backFaceCulling = false;\n    plane.material.specularColor = new BABYLON.Color3(0, 0, 0);\n    plane.material.diffuseTexture = dynamicTexture;\n    return plane;\n  };\n\n  var axisX = BABYLON.Mesh.CreateLines(\"axisX\", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)], scene);\n  axisX.color = new BABYLON.Color3(1, 0, 0);\n  var xChar = makeTextPlane(\"X\", \"red\", size / 10);\n  xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);\n  var axisY = BABYLON.Mesh.CreateLines(\"axisY\", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)], scene);\n  axisY.color = new BABYLON.Color3(0, 1, 0);\n  var yChar = makeTextPlane(\"Y\", \"green\", size / 10);\n  yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);\n  var axisZ = BABYLON.Mesh.CreateLines(\"axisZ\", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)], scene);\n  axisZ.color = new BABYLON.Color3(0, 0, 1);\n  var zChar = makeTextPlane(\"Z\", \"blue\", size / 10);\n  zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);\n};\n/***************************End World Axes***************************/\n\nexports.default = showAxis;\n\n//# sourceURL=webpack:///./src/roomSelect/utils/worldAxis.js?");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQSIsImZpbGUiOiJyb29tU2VsZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvYnVpbGQvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3Jvb21TZWxlY3QvaW5kZXgudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9