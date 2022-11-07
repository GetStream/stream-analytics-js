(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["StreamAnalytics"] = factory();
	else
		root["StreamAnalytics"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, description, main, module, types, scripts, repository, keywords, author, license, bugs, homepage, engines, browser, dependencies, devDependencies, files, default */
/***/ (function(module) {

eval("module.exports = JSON.parse(\"{\\\"name\\\":\\\"stream-analytics\\\",\\\"version\\\":\\\"3.4.4\\\",\\\"description\\\":\\\"Analytics JS client for GetStream.io.\\\",\\\"main\\\":\\\"./lib/stream-analytics.js\\\",\\\"module\\\":\\\"./lib/stream-analytics.js\\\",\\\"types\\\":\\\"./lib/stream-analytics.d.ts\\\",\\\"scripts\\\":{\\\"test\\\":\\\"yarn test-node && yarn test-browser\\\",\\\"test-node\\\":\\\"mocha tests --exit\\\",\\\"test-browser\\\":\\\"karma start karma.config.js\\\",\\\"lint\\\":\\\"yarn run prettier && yarn run eslint\\\",\\\"eslint\\\":\\\"eslint '**/*.{js,ts}' --max-warnings 0\\\",\\\"prettier\\\":\\\"prettier --config ./.prettierrc --list-different \\\\\\\"**/*.{js,ts,md,html,json}\\\\\\\"\\\",\\\"prettier-fix\\\":\\\"prettier --config ./.prettierrc --write \\\\\\\"**/*.{js,ts,md,html,json}\\\\\\\"\\\",\\\"build\\\":\\\"tsc && webpack && webpack --env production\\\",\\\"preversion\\\":\\\"yarn run build && yarn test\\\",\\\"version\\\":\\\"git add -A dist\\\",\\\"postversion\\\":\\\"git push && git push --tags\\\"},\\\"repository\\\":{\\\"type\\\":\\\"git\\\",\\\"url\\\":\\\"git://github.com/GetStream/stream-analytics-js.git\\\"},\\\"keywords\\\":[\\\"npm\\\",\\\"stream-analytics\\\",\\\"getstream.io\\\",\\\"stream.io\\\"],\\\"author\\\":\\\"Tommaso Barbugli <tommaso@getstream.io>\\\",\\\"license\\\":\\\"MIT\\\",\\\"bugs\\\":{\\\"url\\\":\\\"https://github.com/GetStream/stream-analytics-js/issues\\\"},\\\"homepage\\\":\\\"https://github.com/GetStream/stream-analytics-js\\\",\\\"engines\\\":{\\\"node\\\":\\\"10 || 12 || >=14\\\"},\\\"browser\\\":{\\\"cross-fetch\\\":false},\\\"dependencies\\\":{\\\"cross-fetch\\\":\\\"^3.1.5\\\"},\\\"devDependencies\\\":{\\\"@types/node\\\":\\\"^14.11.2\\\",\\\"@typescript-eslint/eslint-plugin\\\":\\\"^4.3.0\\\",\\\"@typescript-eslint/parser\\\":\\\"^4.3.0\\\",\\\"chai\\\":\\\"^4.2.0\\\",\\\"dotenv\\\":\\\"^8.2.0\\\",\\\"eslint\\\":\\\"^7.10.0\\\",\\\"eslint-config-airbnb-base\\\":\\\"^14.2.0\\\",\\\"eslint-config-prettier\\\":\\\"^6.12.0\\\",\\\"eslint-plugin-import\\\":\\\"^2.22.1\\\",\\\"eslint-plugin-prettier\\\":\\\"^3.1.4\\\",\\\"eslint-plugin-typescript-sort-keys\\\":\\\"^1.5.0\\\",\\\"karma\\\":\\\"^6.3.16\\\",\\\"karma-chrome-launcher\\\":\\\"^3.1.0\\\",\\\"karma-mocha\\\":\\\"^2.0.1\\\",\\\"karma-mocha-reporter\\\":\\\"~2.2.5\\\",\\\"karma-sauce-launcher\\\":\\\"^4.1.5\\\",\\\"karma-sourcemap-loader\\\":\\\"~0.3.8\\\",\\\"karma-webpack\\\":\\\"^4.0.2\\\",\\\"mocha\\\":\\\"^8.1.3\\\",\\\"prettier\\\":\\\"^2.1.2\\\",\\\"ts-loader\\\":\\\"^8.0.4\\\",\\\"typescript\\\":\\\"^4.0.3\\\",\\\"webpack\\\":\\\"^4.46.0\\\",\\\"webpack-cli\\\":\\\"^4.10.0\\\"},\\\"files\\\":[\\\"src\\\",\\\"dist\\\",\\\"lib\\\"]}\");\n\n//# sourceURL=webpack://StreamAnalytics/./package.json?");

/***/ }),

/***/ "./src/errors.ts":
/*!***********************!*\
  !*** ./src/errors.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.InvalidInputData = exports.APIError = exports.MisconfiguredClient = exports.MissingUserId = void 0;\nvar canCapture = typeof Error.captureStackTrace === 'function';\nvar canStack = !!new Error().stack;\n// workaround for ES5 compilation to preserve the Error class\nvar ErrorAbstract = function (message) {\n    Error.call(this, message);\n    this.message = message;\n    this.name = this.constructor.name;\n    if (canCapture)\n        Error.captureStackTrace(this);\n    else if (canStack)\n        this.stack = new Error().stack;\n    else\n        this.stack = '';\n};\nErrorAbstract.prototype = Object.create(Error.prototype);\nvar MissingUserId = /** @class */ (function (_super) {\n    __extends(MissingUserId, _super);\n    function MissingUserId() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    return MissingUserId;\n}(ErrorAbstract));\nexports.MissingUserId = MissingUserId;\nvar MisconfiguredClient = /** @class */ (function (_super) {\n    __extends(MisconfiguredClient, _super);\n    function MisconfiguredClient() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    return MisconfiguredClient;\n}(ErrorAbstract));\nexports.MisconfiguredClient = MisconfiguredClient;\nvar APIError = /** @class */ (function (_super) {\n    __extends(APIError, _super);\n    function APIError(msg, response) {\n        var _this = _super.call(this, msg) || this;\n        _this.response = response;\n        return _this;\n    }\n    return APIError;\n}(ErrorAbstract));\nexports.APIError = APIError;\nvar InvalidInputData = /** @class */ (function (_super) {\n    __extends(InvalidInputData, _super);\n    function InvalidInputData(msg, errorInfo) {\n        return _super.call(this, msg + \": \\n\\t\" + errorInfo.join('\\n\\t')) || this;\n    }\n    return InvalidInputData;\n}(ErrorAbstract));\nexports.InvalidInputData = InvalidInputData;\n\n\n//# sourceURL=webpack://StreamAnalytics/./src/errors.ts?");

/***/ }),

/***/ "./src/specs.ts":
/*!**********************!*\
  !*** ./src/specs.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.validateImpression = exports.validateEngagement = void 0;\nfunction isForeginIdType(content) {\n    return typeof content === 'object';\n}\nvar validateFeatures = function (features) {\n    if (!features)\n        return '';\n    if (!Array.isArray(features))\n        return 'features should be array';\n    for (var i = 0; i < features.length; i += 1) {\n        if (!features[i].group || typeof features[i].group !== 'string')\n            return 'feature.group should be string';\n        if (!features[i].value || typeof features[i].value !== 'string')\n            return 'feature.value should be string';\n    }\n    return '';\n};\nexports.validateEngagement = function (engagement) {\n    if (!engagement)\n        return ['engagement should be an object'];\n    var errors = [];\n    if (!engagement.label && typeof engagement.label !== 'string')\n        errors.push('label should be string');\n    if (!engagement.content || (typeof engagement.content !== 'string' && typeof engagement.content !== 'object'))\n        errors.push('content should be string or object');\n    if (isForeginIdType(engagement.content) && !engagement.content.foreign_id)\n        errors.push('content.foreign_id should be string');\n    if (engagement.position !== undefined && typeof engagement.position !== 'number')\n        errors.push('position should be number');\n    if (engagement.score !== undefined && typeof engagement.score !== 'number')\n        errors.push('score should be number');\n    if (engagement.boost !== undefined && typeof engagement.boost !== 'number')\n        errors.push('boost should be number');\n    if (engagement.feed_id !== undefined && typeof engagement.feed_id !== 'string')\n        errors.push('feed_id should be string)');\n    if (engagement.location !== undefined && typeof engagement.location !== 'string')\n        errors.push('location should be string');\n    var featureErr = validateFeatures(engagement.features);\n    if (featureErr)\n        errors.push(featureErr);\n    return errors.length ? errors : false;\n};\nexports.validateImpression = function (impression) {\n    if (!impression)\n        return ['impression should be an object'];\n    var errors = [];\n    if (!Array.isArray(impression.content_list) || !impression.content_list.length)\n        errors.push('content should be array of strings or objects');\n    if (Array.isArray(impression.content_list))\n        impression.content_list.forEach(function (content, i) {\n            if (isForeginIdType(content) && !content.foreign_id)\n                errors.push(\"content_list[\" + i + \"].foreign_id should be string\");\n        });\n    if (impression.feed_id !== undefined && typeof impression.feed_id !== 'string')\n        errors.push('feed_id should be string');\n    if (impression.location !== undefined && typeof impression.location !== 'string')\n        errors.push('location should be string');\n    var featureErr = validateFeatures(impression.features);\n    if (featureErr)\n        errors.push(featureErr);\n    return errors.length ? errors : false;\n};\n\n\n//# sourceURL=webpack://StreamAnalytics/./src/specs.ts?");

/***/ }),

/***/ "./src/stream-analytics.ts":
/*!*********************************!*\
  !*** ./src/stream-analytics.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __assign = (this && this.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nvar cross_fetch_1 = __importDefault(__webpack_require__(/*! cross-fetch */ 1));\nvar errors = __importStar(__webpack_require__(/*! ./errors */ \"./src/errors.ts\"));\nvar specs_1 = __webpack_require__(/*! ./specs */ \"./src/specs.ts\");\n// use native fetch in browser mode to reduce bundle size\n// webpack skip bundling the cross-fetch\nvar request = typeof cross_fetch_1.default === 'function' ? cross_fetch_1.default : window.fetch;\nvar pkg = __webpack_require__(/*! ../package.json */ \"./package.json\"); // eslint-disable-line @typescript-eslint/no-var-requires\nvar StreamAnalytics = /** @class */ (function () {\n    function StreamAnalytics(config) {\n        if (!config || !config.apiKey || !config.token) {\n            throw new errors.MisconfiguredClient('the client must be initialized with apiKey and token');\n        }\n        this.userData = null;\n        this.apiKey = config.apiKey;\n        this.token = config.token;\n        this.baseUrl = config.baseUrl || 'https://analytics.stream-io-api.com/analytics/v1.0/';\n        this.node = typeof window === 'undefined';\n    }\n    StreamAnalytics.prototype.setUser = function (data) {\n        this.userData = data;\n    };\n    StreamAnalytics.prototype.userAgent = function () {\n        return \"stream-javascript-analytics-client-\" + (this.node ? 'node' : 'browser') + \"-\" + (pkg.version || 'unknown');\n    };\n    StreamAnalytics.prototype._throwMissingUserData = function (event) {\n        if (this.userData || event.user_data)\n            return;\n        throw new errors.MissingUserId('user_data should be in each event or set the default with StreamAnalytics.setUser()');\n    };\n    StreamAnalytics.prototype._validateAndNormalizeUserData = function (resource, eventList) {\n        var _this = this;\n        return eventList.map(function (event, i) {\n            var err = resource === 'impression'\n                ? specs_1.validateImpression(event)\n                : specs_1.validateEngagement(event);\n            if (err)\n                throw new errors.InvalidInputData('invalid event data', i ? err.map(function (e) { return i + \": \" + e; }) : err);\n            _this._throwMissingUserData(event);\n            return __assign(__assign({}, event), { user_data: event.user_data || _this.userData });\n        });\n    };\n    StreamAnalytics.prototype._sendEvent = function (resource, eventList) {\n        var events = this._validateAndNormalizeUserData(resource, eventList);\n        return request(this.baseUrl + resource + \"/?api_key=\" + this.apiKey, {\n            method: 'POST',\n            body: JSON.stringify(resource === 'impression' ? events : { content_list: events }),\n            headers: {\n                'Content-Type': 'application/json',\n                'X-Stream-Client': this.userAgent(),\n                'stream-auth-type': 'jwt',\n                Authorization: this.token,\n            },\n        }).then(function (response) {\n            if (response.ok)\n                return response.json();\n            return response.json().then(function (data) {\n                if (data.detail)\n                    throw new errors.APIError(response.statusText + \": \" + data.detail, response);\n                throw new errors.APIError(response.statusText, response);\n            });\n        });\n    };\n    StreamAnalytics.prototype.trackImpression = function (eventData) {\n        return this.trackImpressions([eventData]);\n    };\n    StreamAnalytics.prototype.trackImpressions = function (eventDataList) {\n        return this._sendEvent('impression', eventDataList);\n    };\n    StreamAnalytics.prototype.trackEngagement = function (eventData) {\n        return this.trackEngagements([eventData]);\n    };\n    StreamAnalytics.prototype.trackEngagements = function (eventDataList) {\n        return this._sendEvent('engagement', eventDataList);\n    };\n    return StreamAnalytics;\n}());\nStreamAnalytics.errors = errors;\nmodule.exports = StreamAnalytics;\n\n\n//# sourceURL=webpack://StreamAnalytics/./src/stream-analytics.ts?");

/***/ }),

/***/ 0:
/*!***************************************!*\
  !*** multi ./src/stream-analytics.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./src/stream-analytics.ts */\"./src/stream-analytics.ts\");\n\n\n//# sourceURL=webpack://StreamAnalytics/multi_./src/stream-analytics.ts?");

/***/ }),

/***/ 1:
/*!*****************************!*\
  !*** cross-fetch (ignored) ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack://StreamAnalytics/cross-fetch_(ignored)?");

/***/ })

/******/ });
});