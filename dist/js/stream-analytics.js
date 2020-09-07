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
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var cross_fetch_1 = __importDefault(__webpack_require__(2));
var errors = __importStar(__webpack_require__(3));
var specs_1 = __webpack_require__(4);
// use native fetch in browser mode to reduce bundle size
// webpack skip bundling the cross-fetch
var request = typeof cross_fetch_1.default === 'function' ? cross_fetch_1.default : window.fetch;
var pkg = __webpack_require__(5); // eslint-disable-line @typescript-eslint/no-var-requires
var StreamAnalytics = /** @class */ (function () {
    function StreamAnalytics(config) {
        if (!config || !config.apiKey || !config.token) {
            throw new errors.MisconfiguredClient('the client must be initialized with apiKey and token');
        }
        this.userData = null;
        this.apiKey = config.apiKey;
        this.token = config.token;
        this.baseUrl = 'https://analytics.stream-io-api.com/analytics/v1.0/';
        this.node = typeof window === 'undefined';
    }
    StreamAnalytics.prototype.setUser = function (data) {
        this.userData = data;
    };
    StreamAnalytics.prototype.userAgent = function () {
        return "stream-javascript-analytics-client-" + (this.node ? 'node' : 'browser') + "-" + (pkg.version || 'unknown');
    };
    StreamAnalytics.prototype._sendEvent = function (resource, eventData) {
        if (this.userData === null)
            throw new errors.MissingUserId('userData was not set');
        return request(this.baseUrl + resource + "/?api_key=" + this.apiKey, {
            method: 'POST',
            body: JSON.stringify(__assign(__assign({}, eventData), { user_data: this.userData })),
            headers: {
                'Content-Type': 'application/json',
                'X-Stream-Client': this.userAgent(),
                'stream-auth-type': 'jwt',
                Authorization: this.token,
            },
        }).then(function (response) {
            if (response.ok)
                return response.json();
            throw new errors.APIError(response.statusText);
        });
    };
    StreamAnalytics.prototype.trackImpression = function (eventData) {
        var err = specs_1.validateImpression(eventData);
        if (err)
            throw new errors.InvalidInputData('event data is not valid', err);
        return this._sendEvent('impression', eventData);
    };
    StreamAnalytics.prototype.trackEngagement = function (eventData) {
        var err = specs_1.validateEngagement(eventData);
        if (err)
            throw new errors.InvalidInputData('event data is not valid', err);
        return this._sendEvent('engagement', eventData);
    };
    return StreamAnalytics;
}());
StreamAnalytics.errors = errors;
module.exports = StreamAnalytics;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidInputData = exports.APIError = exports.MisconfiguredClient = exports.MissingUserId = void 0;
var canCapture = typeof Error.captureStackTrace === 'function';
var canStack = !!new Error().stack;
// workaround for ES5 compilation to preserve the Error class
var ErrorAbstract = function (message) {
    Error.call(this, message);
    this.message = message;
    this.name = this.constructor.name;
    if (canCapture)
        Error.captureStackTrace(this);
    else if (canStack)
        this.stack = new Error().stack;
    else
        this.stack = '';
};
ErrorAbstract.prototype = Object.create(Error.prototype);
var MissingUserId = /** @class */ (function (_super) {
    __extends(MissingUserId, _super);
    function MissingUserId() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MissingUserId;
}(ErrorAbstract));
exports.MissingUserId = MissingUserId;
var MisconfiguredClient = /** @class */ (function (_super) {
    __extends(MisconfiguredClient, _super);
    function MisconfiguredClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MisconfiguredClient;
}(ErrorAbstract));
exports.MisconfiguredClient = MisconfiguredClient;
var APIError = /** @class */ (function (_super) {
    __extends(APIError, _super);
    function APIError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return APIError;
}(ErrorAbstract));
exports.APIError = APIError;
var InvalidInputData = /** @class */ (function (_super) {
    __extends(InvalidInputData, _super);
    function InvalidInputData(msg, errorInfo) {
        return _super.call(this, msg + ": \n\t" + errorInfo.join('\n\t')) || this;
    }
    return InvalidInputData;
}(ErrorAbstract));
exports.InvalidInputData = InvalidInputData;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImpression = exports.validateEngagement = void 0;
var validateFeatures = function (features) {
    if (!features)
        return '';
    if (!Array.isArray(features))
        return 'features should be array';
    for (var i = 0; i < features.length; i += 1) {
        if (!features[i].group || typeof features[i].group !== 'string')
            return 'feature.group should be string';
        if (!features[i].value || typeof features[i].value !== 'string')
            return 'feature.value should be string';
    }
    return '';
};
exports.validateEngagement = function (engagement) {
    if (!engagement)
        return ['engagement should be an object'];
    var errors = [];
    if (!engagement.label && typeof engagement.label !== 'string')
        errors.push('label should be string');
    if (!engagement.content || (typeof engagement.content !== 'string' && typeof engagement.content !== 'object'))
        errors.push('content should be string or object');
    if (engagement.position !== undefined && typeof engagement.position !== 'number')
        errors.push('position should be number');
    if (engagement.score !== undefined && typeof engagement.score !== 'number')
        errors.push('score should be number');
    if (engagement.boost !== undefined && typeof engagement.boost !== 'number')
        errors.push('boost should be number');
    if (engagement.feed_id !== undefined && typeof engagement.feed_id !== 'string')
        errors.push('feed_id should be string)');
    if (engagement.location !== undefined && typeof engagement.location !== 'string')
        errors.push('location should be string');
    var featureErr = validateFeatures(engagement.features);
    if (featureErr)
        errors.push(featureErr);
    return errors.length ? errors : false;
};
exports.validateImpression = function (impression) {
    if (!impression)
        return ['impression should be an object'];
    var errors = [];
    if (!Array.isArray(impression.content_list) || !impression.content_list.length)
        errors.push('content should be array of strings or objects');
    if (impression.feed_id !== undefined && typeof impression.feed_id !== 'string')
        errors.push('feed_id should be string');
    if (impression.location !== undefined && typeof impression.location !== 'string')
        errors.push('location should be string');
    var featureErr = validateFeatures(impression.features);
    if (featureErr)
        errors.push(featureErr);
    return errors.length ? errors : false;
};


/***/ }),
/* 5 */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"stream-analytics\",\"version\":\"2.8.0\",\"description\":\"Analytics JS client for GetStream.io.\",\"main\":\"./lib/stream-analytics.js\",\"module\":\"./lib/stream-analytics.js\",\"types\":\"./lib/stream-analytics.d.ts\",\"scripts\":{\"test\":\"yarn test-node && yarn test-browser\",\"test-node\":\"mocha tests --exit\",\"test-browser\":\"karma start karma.config.js\",\"lint\":\"yarn run prettier && yarn run eslint\",\"eslint\":\"eslint '**/*.{js,ts}' --max-warnings 0\",\"prettier\":\"prettier --config ./.prettierrc --list-different \\\"**/*.{js,ts,md,html,json}\\\"\",\"prettier-fix\":\"prettier --config ./.prettierrc --write \\\"**/*.{js,ts,md,html,json}\\\"\",\"build\":\"tsc && webpack && webpack --minify\",\"preversion\":\"npm test\",\"version\":\"npm run build && git add -A dist\",\"postversion\":\"git push && git push --tags\"},\"repository\":{\"type\":\"git\",\"url\":\"git://github.com/GetStream/stream-analytics-js.git\"},\"keywords\":[\"npm\",\"stream-analytics\",\"getstream.io\",\"stream.io\"],\"author\":\"Tommaso Barbugli <tommaso@getstream.io>\",\"license\":\"MIT\",\"bugs\":{\"url\":\"https://github.com/GetStream/stream-analytics-js/issues\"},\"homepage\":\"https://github.com/GetStream/stream-analytics-js\",\"engines\":{\"node\":\"10 || 12 || >=14\"},\"browser\":{\"cross-fetch\":false},\"dependencies\":{\"cross-fetch\":\"^3.0.5\"},\"devDependencies\":{\"@types/node\":\"^14.6.0\",\"@typescript-eslint/eslint-plugin\":\"^3.10.1\",\"@typescript-eslint/parser\":\"^3.10.1\",\"eslint\":\"^7.7.0\",\"eslint-config-airbnb-base\":\"^14.2.0\",\"eslint-config-prettier\":\"^6.11.0\",\"eslint-plugin-import\":\"^2.22.0\",\"eslint-plugin-prettier\":\"^3.1.4\",\"eslint-plugin-typescript-sort-keys\":\"^1.3.0\",\"expect.js\":\"^0.3.1\",\"karma\":\"^5.1.1\",\"karma-chrome-launcher\":\"^3.1.0\",\"karma-mocha\":\"^2.0.1\",\"karma-mocha-reporter\":\"~2.2.5\",\"karma-sauce-launcher\":\"^4.1.5\",\"karma-sourcemap-loader\":\"~0.3.8\",\"karma-webpack\":\"^4.0.2\",\"mocha\":\"^8.1.2\",\"prettier\":\"^2.1.1\",\"ts-loader\":\"^8.0.3\",\"typescript\":\"^4.0.2\",\"webpack\":\"^4.44.1\",\"webpack-cli\":\"^3.3.12\"},\"files\":[\"src\",\"dist\",\"lib\"]}");

/***/ })
/******/ ]);
});