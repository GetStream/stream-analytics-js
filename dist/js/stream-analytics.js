(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["StreamAnalytics"] = factory();
	else
		root["StreamAnalytics"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var validate = __webpack_require__(2),
	  specs = __webpack_require__(5),
	  errors = __webpack_require__(6),
	  Client = __webpack_require__(7);

	var StreamAnalytics = function (config) {
	  this.configure(config || {});
	};

	StreamAnalytics.prototype.configure = function (cfg) {
	  this.client = new Client(cfg);
	  this.userData = null;
	};

	StreamAnalytics.prototype.setUser = function (userData) {
	  this.userData = userData;
	};

	StreamAnalytics.prototype._sendEventFactory = function (resourceName, dataSpec) {
	  // snakeCase
	  return function (eventData) {
	    var validationErrors = validate(eventData, dataSpec, { format: 'flat' });
	    if (typeof (validationErrors) !== 'undefined') {
	      throw new errors.InvalidInputData('event data is not valid', validationErrors);
	    }

	    return this._sendEvent(resourceName, eventData);
	  };
	};

	StreamAnalytics.prototype._sendEvent = function (resourceName, eventData) {
	  if (this.userData === null) {
	    throw new errors.MissingUserId('userData was not set');
	  }

	  eventData['user_data'] = this.userData;
	  return this.client.send(resourceName, eventData);
	};

	StreamAnalytics.prototype.trackImpression =
	  StreamAnalytics.prototype._sendEventFactory(
	    'impression',
	    specs.impressionSpec
	  );
	StreamAnalytics.prototype.trackEngagement =
	  StreamAnalytics.prototype._sendEventFactory(
	    'engagement',
	    specs.engagementSpec
	  );

	StreamAnalytics.Client = Client;
	StreamAnalytics.errors = errors;

	if (typeof (window) !== 'undefined')
	  __webpack_require__(9)(StreamAnalytics);

	module.exports = StreamAnalytics;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/*!
	 * validate.js 0.12.0
	 *
	 * (c) 2013-2017 Nicklas Ansman, 2013 Wrapp
	 * Validate.js may be freely distributed under the MIT license.
	 * For all details and documentation:
	 * http://validatejs.org/
	 */

	(function(exports, module, define) {
	  "use strict";

	  // The main function that calls the validators specified by the constraints.
	  // The options are the following:
	  //   - format (string) - An option that controls how the returned value is formatted
	  //     * flat - Returns a flat array of just the error messages
	  //     * grouped - Returns the messages grouped by attribute (default)
	  //     * detailed - Returns an array of the raw validation data
	  //   - fullMessages (boolean) - If `true` (default) the attribute name is prepended to the error.
	  //
	  // Please note that the options are also passed to each validator.
	  var validate = function(attributes, constraints, options) {
	    options = v.extend({}, v.options, options);

	    var results = v.runValidations(attributes, constraints, options)
	      , attr
	      , validator;

	    if (results.some(function(r) { return v.isPromise(r.error); })) {
	      throw new Error("Use validate.async if you want support for promises");
	    }
	    return validate.processValidationResults(results, options);
	  };

	  var v = validate;

	  // Copies over attributes from one or more sources to a single destination.
	  // Very much similar to underscore's extend.
	  // The first argument is the target object and the remaining arguments will be
	  // used as sources.
	  v.extend = function(obj) {
	    [].slice.call(arguments, 1).forEach(function(source) {
	      for (var attr in source) {
	        obj[attr] = source[attr];
	      }
	    });
	    return obj;
	  };

	  v.extend(validate, {
	    // This is the version of the library as a semver.
	    // The toString function will allow it to be coerced into a string
	    version: {
	      major: 0,
	      minor: 12,
	      patch: 0,
	      metadata: null,
	      toString: function() {
	        var version = v.format("%{major}.%{minor}.%{patch}", v.version);
	        if (!v.isEmpty(v.version.metadata)) {
	          version += "+" + v.version.metadata;
	        }
	        return version;
	      }
	    },

	    // Below is the dependencies that are used in validate.js

	    // The constructor of the Promise implementation.
	    // If you are using Q.js, RSVP or any other A+ compatible implementation
	    // override this attribute to be the constructor of that promise.
	    // Since jQuery promises aren't A+ compatible they won't work.
	    Promise: typeof Promise !== "undefined" ? Promise : /* istanbul ignore next */ null,

	    EMPTY_STRING_REGEXP: /^\s*$/,

	    // Runs the validators specified by the constraints object.
	    // Will return an array of the format:
	    //     [{attribute: "<attribute name>", error: "<validation result>"}, ...]
	    runValidations: function(attributes, constraints, options) {
	      var results = []
	        , attr
	        , validatorName
	        , value
	        , validators
	        , validator
	        , validatorOptions
	        , error;

	      if (v.isDomElement(attributes) || v.isJqueryElement(attributes)) {
	        attributes = v.collectFormValues(attributes);
	      }

	      // Loops through each constraints, finds the correct validator and run it.
	      for (attr in constraints) {
	        value = v.getDeepObjectValue(attributes, attr);
	        // This allows the constraints for an attribute to be a function.
	        // The function will be called with the value, attribute name, the complete dict of
	        // attributes as well as the options and constraints passed in.
	        // This is useful when you want to have different
	        // validations depending on the attribute value.
	        validators = v.result(constraints[attr], value, attributes, attr, options, constraints);

	        for (validatorName in validators) {
	          validator = v.validators[validatorName];

	          if (!validator) {
	            error = v.format("Unknown validator %{name}", {name: validatorName});
	            throw new Error(error);
	          }

	          validatorOptions = validators[validatorName];
	          // This allows the options to be a function. The function will be
	          // called with the value, attribute name, the complete dict of
	          // attributes as well as the options and constraints passed in.
	          // This is useful when you want to have different
	          // validations depending on the attribute value.
	          validatorOptions = v.result(validatorOptions, value, attributes, attr, options, constraints);
	          if (!validatorOptions) {
	            continue;
	          }
	          results.push({
	            attribute: attr,
	            value: value,
	            validator: validatorName,
	            globalOptions: options,
	            attributes: attributes,
	            options: validatorOptions,
	            error: validator.call(validator,
	                value,
	                validatorOptions,
	                attr,
	                attributes,
	                options)
	          });
	        }
	      }

	      return results;
	    },

	    // Takes the output from runValidations and converts it to the correct
	    // output format.
	    processValidationResults: function(errors, options) {
	      errors = v.pruneEmptyErrors(errors, options);
	      errors = v.expandMultipleErrors(errors, options);
	      errors = v.convertErrorMessages(errors, options);

	      var format = options.format || "grouped";

	      if (typeof v.formatters[format] === 'function') {
	        errors = v.formatters[format](errors);
	      } else {
	        throw new Error(v.format("Unknown format %{format}", options));
	      }

	      return v.isEmpty(errors) ? undefined : errors;
	    },

	    // Runs the validations with support for promises.
	    // This function will return a promise that is settled when all the
	    // validation promises have been completed.
	    // It can be called even if no validations returned a promise.
	    async: function(attributes, constraints, options) {
	      options = v.extend({}, v.async.options, options);

	      var WrapErrors = options.wrapErrors || function(errors) {
	        return errors;
	      };

	      // Removes unknown attributes
	      if (options.cleanAttributes !== false) {
	        attributes = v.cleanAttributes(attributes, constraints);
	      }

	      var results = v.runValidations(attributes, constraints, options);

	      return new v.Promise(function(resolve, reject) {
	        v.waitForResults(results).then(function() {
	          var errors = v.processValidationResults(results, options);
	          if (errors) {
	            reject(new WrapErrors(errors, options, attributes, constraints));
	          } else {
	            resolve(attributes);
	          }
	        }, function(err) {
	          reject(err);
	        });
	      });
	    },

	    single: function(value, constraints, options) {
	      options = v.extend({}, v.single.options, options, {
	        format: "flat",
	        fullMessages: false
	      });
	      return v({single: value}, {single: constraints}, options);
	    },

	    // Returns a promise that is resolved when all promises in the results array
	    // are settled. The promise returned from this function is always resolved,
	    // never rejected.
	    // This function modifies the input argument, it replaces the promises
	    // with the value returned from the promise.
	    waitForResults: function(results) {
	      // Create a sequence of all the results starting with a resolved promise.
	      return results.reduce(function(memo, result) {
	        // If this result isn't a promise skip it in the sequence.
	        if (!v.isPromise(result.error)) {
	          return memo;
	        }

	        return memo.then(function() {
	          return result.error.then(function(error) {
	            result.error = error || null;
	          });
	        });
	      }, new v.Promise(function(r) { r(); })); // A resolved promise
	    },

	    // If the given argument is a call: function the and: function return the value
	    // otherwise just return the value. Additional arguments will be passed as
	    // arguments to the function.
	    // Example:
	    // ```
	    // result('foo') // 'foo'
	    // result(Math.max, 1, 2) // 2
	    // ```
	    result: function(value) {
	      var args = [].slice.call(arguments, 1);
	      if (typeof value === 'function') {
	        value = value.apply(null, args);
	      }
	      return value;
	    },

	    // Checks if the value is a number. This function does not consider NaN a
	    // number like many other `isNumber` functions do.
	    isNumber: function(value) {
	      return typeof value === 'number' && !isNaN(value);
	    },

	    // Returns false if the object is not a function
	    isFunction: function(value) {
	      return typeof value === 'function';
	    },

	    // A simple check to verify that the value is an integer. Uses `isNumber`
	    // and a simple modulo check.
	    isInteger: function(value) {
	      return v.isNumber(value) && value % 1 === 0;
	    },

	    // Checks if the value is a boolean
	    isBoolean: function(value) {
	      return typeof value === 'boolean';
	    },

	    // Uses the `Object` function to check if the given argument is an object.
	    isObject: function(obj) {
	      return obj === Object(obj);
	    },

	    // Simply checks if the object is an instance of a date
	    isDate: function(obj) {
	      return obj instanceof Date;
	    },

	    // Returns false if the object is `null` of `undefined`
	    isDefined: function(obj) {
	      return obj !== null && obj !== undefined;
	    },

	    // Checks if the given argument is a promise. Anything with a `then`
	    // function is considered a promise.
	    isPromise: function(p) {
	      return !!p && v.isFunction(p.then);
	    },

	    isJqueryElement: function(o) {
	      return o && v.isString(o.jquery);
	    },

	    isDomElement: function(o) {
	      if (!o) {
	        return false;
	      }

	      if (!o.querySelectorAll || !o.querySelector) {
	        return false;
	      }

	      if (v.isObject(document) && o === document) {
	        return true;
	      }

	      // http://stackoverflow.com/a/384380/699304
	      /* istanbul ignore else */
	      if (typeof HTMLElement === "object") {
	        return o instanceof HTMLElement;
	      } else {
	        return o &&
	          typeof o === "object" &&
	          o !== null &&
	          o.nodeType === 1 &&
	          typeof o.nodeName === "string";
	      }
	    },

	    isEmpty: function(value) {
	      var attr;

	      // Null and undefined are empty
	      if (!v.isDefined(value)) {
	        return true;
	      }

	      // functions are non empty
	      if (v.isFunction(value)) {
	        return false;
	      }

	      // Whitespace only strings are empty
	      if (v.isString(value)) {
	        return v.EMPTY_STRING_REGEXP.test(value);
	      }

	      // For arrays we use the length property
	      if (v.isArray(value)) {
	        return value.length === 0;
	      }

	      // Dates have no attributes but aren't empty
	      if (v.isDate(value)) {
	        return false;
	      }

	      // If we find at least one property we consider it non empty
	      if (v.isObject(value)) {
	        for (attr in value) {
	          return false;
	        }
	        return true;
	      }

	      return false;
	    },

	    // Formats the specified strings with the given values like so:
	    // ```
	    // format("Foo: %{foo}", {foo: "bar"}) // "Foo bar"
	    // ```
	    // If you want to write %{...} without having it replaced simply
	    // prefix it with % like this `Foo: %%{foo}` and it will be returned
	    // as `"Foo: %{foo}"`
	    format: v.extend(function(str, vals) {
	      if (!v.isString(str)) {
	        return str;
	      }
	      return str.replace(v.format.FORMAT_REGEXP, function(m0, m1, m2) {
	        if (m1 === '%') {
	          return "%{" + m2 + "}";
	        } else {
	          return String(vals[m2]);
	        }
	      });
	    }, {
	      // Finds %{key} style patterns in the given string
	      FORMAT_REGEXP: /(%?)%\{([^\}]+)\}/g
	    }),

	    // "Prettifies" the given string.
	    // Prettifying means replacing [.\_-] with spaces as well as splitting
	    // camel case words.
	    prettify: function(str) {
	      if (v.isNumber(str)) {
	        // If there are more than 2 decimals round it to two
	        if ((str * 100) % 1 === 0) {
	          return "" + str;
	        } else {
	          return parseFloat(Math.round(str * 100) / 100).toFixed(2);
	        }
	      }

	      if (v.isArray(str)) {
	        return str.map(function(s) { return v.prettify(s); }).join(", ");
	      }

	      if (v.isObject(str)) {
	        return str.toString();
	      }

	      // Ensure the string is actually a string
	      str = "" + str;

	      return str
	        // Splits keys separated by periods
	        .replace(/([^\s])\.([^\s])/g, '$1 $2')
	        // Removes backslashes
	        .replace(/\\+/g, '')
	        // Replaces - and - with space
	        .replace(/[_-]/g, ' ')
	        // Splits camel cased words
	        .replace(/([a-z])([A-Z])/g, function(m0, m1, m2) {
	          return "" + m1 + " " + m2.toLowerCase();
	        })
	        .toLowerCase();
	    },

	    stringifyValue: function(value, options) {
	      var prettify = options && options.prettify || v.prettify;
	      return prettify(value);
	    },

	    isString: function(value) {
	      return typeof value === 'string';
	    },

	    isArray: function(value) {
	      return {}.toString.call(value) === '[object Array]';
	    },

	    // Checks if the object is a hash, which is equivalent to an object that
	    // is neither an array nor a function.
	    isHash: function(value) {
	      return v.isObject(value) && !v.isArray(value) && !v.isFunction(value);
	    },

	    contains: function(obj, value) {
	      if (!v.isDefined(obj)) {
	        return false;
	      }
	      if (v.isArray(obj)) {
	        return obj.indexOf(value) !== -1;
	      }
	      return value in obj;
	    },

	    unique: function(array) {
	      if (!v.isArray(array)) {
	        return array;
	      }
	      return array.filter(function(el, index, array) {
	        return array.indexOf(el) == index;
	      });
	    },

	    forEachKeyInKeypath: function(object, keypath, callback) {
	      if (!v.isString(keypath)) {
	        return undefined;
	      }

	      var key = ""
	        , i
	        , escape = false;

	      for (i = 0; i < keypath.length; ++i) {
	        switch (keypath[i]) {
	          case '.':
	            if (escape) {
	              escape = false;
	              key += '.';
	            } else {
	              object = callback(object, key, false);
	              key = "";
	            }
	            break;

	          case '\\':
	            if (escape) {
	              escape = false;
	              key += '\\';
	            } else {
	              escape = true;
	            }
	            break;

	          default:
	            escape = false;
	            key += keypath[i];
	            break;
	        }
	      }

	      return callback(object, key, true);
	    },

	    getDeepObjectValue: function(obj, keypath) {
	      if (!v.isObject(obj)) {
	        return undefined;
	      }

	      return v.forEachKeyInKeypath(obj, keypath, function(obj, key) {
	        if (v.isObject(obj)) {
	          return obj[key];
	        }
	      });
	    },

	    // This returns an object with all the values of the form.
	    // It uses the input name as key and the value as value
	    // So for example this:
	    // <input type="text" name="email" value="foo@bar.com" />
	    // would return:
	    // {email: "foo@bar.com"}
	    collectFormValues: function(form, options) {
	      var values = {}
	        , i
	        , j
	        , input
	        , inputs
	        , option
	        , value;

	      if (v.isJqueryElement(form)) {
	        form = form[0];
	      }

	      if (!form) {
	        return values;
	      }

	      options = options || {};

	      inputs = form.querySelectorAll("input[name], textarea[name]");
	      for (i = 0; i < inputs.length; ++i) {
	        input = inputs.item(i);

	        if (v.isDefined(input.getAttribute("data-ignored"))) {
	          continue;
	        }

	        name = input.name.replace(/\./g, "\\\\.");
	        value = v.sanitizeFormValue(input.value, options);
	        if (input.type === "number") {
	          value = value ? +value : null;
	        } else if (input.type === "checkbox") {
	          if (input.attributes.value) {
	            if (!input.checked) {
	              value = values[name] || null;
	            }
	          } else {
	            value = input.checked;
	          }
	        } else if (input.type === "radio") {
	          if (!input.checked) {
	            value = values[name] || null;
	          }
	        }
	        values[name] = value;
	      }

	      inputs = form.querySelectorAll("select[name]");
	      for (i = 0; i < inputs.length; ++i) {
	        input = inputs.item(i);
	        if (v.isDefined(input.getAttribute("data-ignored"))) {
	          continue;
	        }

	        if (input.multiple) {
	          value = [];
	          for (j in input.options) {
	            option = input.options[j];
	             if (option && option.selected) {
	              value.push(v.sanitizeFormValue(option.value, options));
	            }
	          }
	        } else {
	          var _val = typeof input.options[input.selectedIndex] !== 'undefined' ? input.options[input.selectedIndex].value : '';
	          value = v.sanitizeFormValue(_val, options);
	        }
	        values[input.name] = value;
	      }

	      return values;
	    },

	    sanitizeFormValue: function(value, options) {
	      if (options.trim && v.isString(value)) {
	        value = value.trim();
	      }

	      if (options.nullify !== false && value === "") {
	        return null;
	      }
	      return value;
	    },

	    capitalize: function(str) {
	      if (!v.isString(str)) {
	        return str;
	      }
	      return str[0].toUpperCase() + str.slice(1);
	    },

	    // Remove all errors who's error attribute is empty (null or undefined)
	    pruneEmptyErrors: function(errors) {
	      return errors.filter(function(error) {
	        return !v.isEmpty(error.error);
	      });
	    },

	    // In
	    // [{error: ["err1", "err2"], ...}]
	    // Out
	    // [{error: "err1", ...}, {error: "err2", ...}]
	    //
	    // All attributes in an error with multiple messages are duplicated
	    // when expanding the errors.
	    expandMultipleErrors: function(errors) {
	      var ret = [];
	      errors.forEach(function(error) {
	        // Removes errors without a message
	        if (v.isArray(error.error)) {
	          error.error.forEach(function(msg) {
	            ret.push(v.extend({}, error, {error: msg}));
	          });
	        } else {
	          ret.push(error);
	        }
	      });
	      return ret;
	    },

	    // Converts the error mesages by prepending the attribute name unless the
	    // message is prefixed by ^
	    convertErrorMessages: function(errors, options) {
	      options = options || {};

	      var ret = []
	        , prettify = options.prettify || v.prettify;
	      errors.forEach(function(errorInfo) {
	        var error = v.result(errorInfo.error,
	            errorInfo.value,
	            errorInfo.attribute,
	            errorInfo.options,
	            errorInfo.attributes,
	            errorInfo.globalOptions);

	        if (!v.isString(error)) {
	          ret.push(errorInfo);
	          return;
	        }

	        if (error[0] === '^') {
	          error = error.slice(1);
	        } else if (options.fullMessages !== false) {
	          error = v.capitalize(prettify(errorInfo.attribute)) + " " + error;
	        }
	        error = error.replace(/\\\^/g, "^");
	        error = v.format(error, {
	          value: v.stringifyValue(errorInfo.value, options)
	        });
	        ret.push(v.extend({}, errorInfo, {error: error}));
	      });
	      return ret;
	    },

	    // In:
	    // [{attribute: "<attributeName>", ...}]
	    // Out:
	    // {"<attributeName>": [{attribute: "<attributeName>", ...}]}
	    groupErrorsByAttribute: function(errors) {
	      var ret = {};
	      errors.forEach(function(error) {
	        var list = ret[error.attribute];
	        if (list) {
	          list.push(error);
	        } else {
	          ret[error.attribute] = [error];
	        }
	      });
	      return ret;
	    },

	    // In:
	    // [{error: "<message 1>", ...}, {error: "<message 2>", ...}]
	    // Out:
	    // ["<message 1>", "<message 2>"]
	    flattenErrorsToArray: function(errors) {
	      return errors
	        .map(function(error) { return error.error; })
	        .filter(function(value, index, self) {
	          return self.indexOf(value) === index;
	        });
	    },

	    cleanAttributes: function(attributes, whitelist) {
	      function whitelistCreator(obj, key, last) {
	        if (v.isObject(obj[key])) {
	          return obj[key];
	        }
	        return (obj[key] = last ? true : {});
	      }

	      function buildObjectWhitelist(whitelist) {
	        var ow = {}
	          , lastObject
	          , attr;
	        for (attr in whitelist) {
	          if (!whitelist[attr]) {
	            continue;
	          }
	          v.forEachKeyInKeypath(ow, attr, whitelistCreator);
	        }
	        return ow;
	      }

	      function cleanRecursive(attributes, whitelist) {
	        if (!v.isObject(attributes)) {
	          return attributes;
	        }

	        var ret = v.extend({}, attributes)
	          , w
	          , attribute;

	        for (attribute in attributes) {
	          w = whitelist[attribute];

	          if (v.isObject(w)) {
	            ret[attribute] = cleanRecursive(ret[attribute], w);
	          } else if (!w) {
	            delete ret[attribute];
	          }
	        }
	        return ret;
	      }

	      if (!v.isObject(whitelist) || !v.isObject(attributes)) {
	        return {};
	      }

	      whitelist = buildObjectWhitelist(whitelist);
	      return cleanRecursive(attributes, whitelist);
	    },

	    exposeModule: function(validate, root, exports, module, define) {
	      if (exports) {
	        if (module && module.exports) {
	          exports = module.exports = validate;
	        }
	        exports.validate = validate;
	      } else {
	        root.validate = validate;
	        if (validate.isFunction(define) && define.amd) {
	          define([], function () { return validate; });
	        }
	      }
	    },

	    warn: function(msg) {
	      if (typeof console !== "undefined" && console.warn) {
	        console.warn("[validate.js] " + msg);
	      }
	    },

	    error: function(msg) {
	      if (typeof console !== "undefined" && console.error) {
	        console.error("[validate.js] " + msg);
	      }
	    }
	  });

	  validate.validators = {
	    // Presence validates that the value isn't empty
	    presence: function(value, options) {
	      options = v.extend({}, this.options, options);
	      if (options.allowEmpty !== false ? !v.isDefined(value) : v.isEmpty(value)) {
	        return options.message || this.message || "can't be blank";
	      }
	    },
	    length: function(value, options, attribute) {
	      // Empty values are allowed
	      if (!v.isDefined(value)) {
	        return;
	      }

	      options = v.extend({}, this.options, options);

	      var is = options.is
	        , maximum = options.maximum
	        , minimum = options.minimum
	        , tokenizer = options.tokenizer || function(val) { return val; }
	        , err
	        , errors = [];

	      value = tokenizer(value);
	      var length = value.length;
	      if(!v.isNumber(length)) {
	        v.error(v.format("Attribute %{attr} has a non numeric value for `length`", {attr: attribute}));
	        return options.message || this.notValid || "has an incorrect length";
	      }

	      // Is checks
	      if (v.isNumber(is) && length !== is) {
	        err = options.wrongLength ||
	          this.wrongLength ||
	          "is the wrong length (should be %{count} characters)";
	        errors.push(v.format(err, {count: is}));
	      }

	      if (v.isNumber(minimum) && length < minimum) {
	        err = options.tooShort ||
	          this.tooShort ||
	          "is too short (minimum is %{count} characters)";
	        errors.push(v.format(err, {count: minimum}));
	      }

	      if (v.isNumber(maximum) && length > maximum) {
	        err = options.tooLong ||
	          this.tooLong ||
	          "is too long (maximum is %{count} characters)";
	        errors.push(v.format(err, {count: maximum}));
	      }

	      if (errors.length > 0) {
	        return options.message || errors;
	      }
	    },
	    numericality: function(value, options, attribute, attributes, globalOptions) {
	      // Empty values are fine
	      if (!v.isDefined(value)) {
	        return;
	      }

	      options = v.extend({}, this.options, options);

	      var errors = []
	        , name
	        , count
	        , checks = {
	            greaterThan:          function(v, c) { return v > c; },
	            greaterThanOrEqualTo: function(v, c) { return v >= c; },
	            equalTo:              function(v, c) { return v === c; },
	            lessThan:             function(v, c) { return v < c; },
	            lessThanOrEqualTo:    function(v, c) { return v <= c; },
	            divisibleBy:          function(v, c) { return v % c === 0; }
	          }
	        , prettify = options.prettify ||
	          (globalOptions && globalOptions.prettify) ||
	          v.prettify;

	      // Strict will check that it is a valid looking number
	      if (v.isString(value) && options.strict) {
	        var pattern = "^-?(0|[1-9]\\d*)";
	        if (!options.onlyInteger) {
	          pattern += "(\\.\\d+)?";
	        }
	        pattern += "$";

	        if (!(new RegExp(pattern).test(value))) {
	          return options.message ||
	            options.notValid ||
	            this.notValid ||
	            this.message ||
	            "must be a valid number";
	        }
	      }

	      // Coerce the value to a number unless we're being strict.
	      if (options.noStrings !== true && v.isString(value) && !v.isEmpty(value)) {
	        value = +value;
	      }

	      // If it's not a number we shouldn't continue since it will compare it.
	      if (!v.isNumber(value)) {
	        return options.message ||
	          options.notValid ||
	          this.notValid ||
	          this.message ||
	          "is not a number";
	      }

	      // Same logic as above, sort of. Don't bother with comparisons if this
	      // doesn't pass.
	      if (options.onlyInteger && !v.isInteger(value)) {
	        return options.message ||
	          options.notInteger ||
	          this.notInteger ||
	          this.message ||
	          "must be an integer";
	      }

	      for (name in checks) {
	        count = options[name];
	        if (v.isNumber(count) && !checks[name](value, count)) {
	          // This picks the default message if specified
	          // For example the greaterThan check uses the message from
	          // this.notGreaterThan so we capitalize the name and prepend "not"
	          var key = "not" + v.capitalize(name);
	          var msg = options[key] ||
	            this[key] ||
	            this.message ||
	            "must be %{type} %{count}";

	          errors.push(v.format(msg, {
	            count: count,
	            type: prettify(name)
	          }));
	        }
	      }

	      if (options.odd && value % 2 !== 1) {
	        errors.push(options.notOdd ||
	            this.notOdd ||
	            this.message ||
	            "must be odd");
	      }
	      if (options.even && value % 2 !== 0) {
	        errors.push(options.notEven ||
	            this.notEven ||
	            this.message ||
	            "must be even");
	      }

	      if (errors.length) {
	        return options.message || errors;
	      }
	    },
	    datetime: v.extend(function(value, options) {
	      if (!v.isFunction(this.parse) || !v.isFunction(this.format)) {
	        throw new Error("Both the parse and format functions needs to be set to use the datetime/date validator");
	      }

	      // Empty values are fine
	      if (!v.isDefined(value)) {
	        return;
	      }

	      options = v.extend({}, this.options, options);

	      var err
	        , errors = []
	        , earliest = options.earliest ? this.parse(options.earliest, options) : NaN
	        , latest = options.latest ? this.parse(options.latest, options) : NaN;

	      value = this.parse(value, options);

	      // 86400000 is the number of milliseconds in a day, this is used to remove
	      // the time from the date
	      if (isNaN(value) || options.dateOnly && value % 86400000 !== 0) {
	        err = options.notValid ||
	          options.message ||
	          this.notValid ||
	          "must be a valid date";
	        return v.format(err, {value: arguments[0]});
	      }

	      if (!isNaN(earliest) && value < earliest) {
	        err = options.tooEarly ||
	          options.message ||
	          this.tooEarly ||
	          "must be no earlier than %{date}";
	        err = v.format(err, {
	          value: this.format(value, options),
	          date: this.format(earliest, options)
	        });
	        errors.push(err);
	      }

	      if (!isNaN(latest) && value > latest) {
	        err = options.tooLate ||
	          options.message ||
	          this.tooLate ||
	          "must be no later than %{date}";
	        err = v.format(err, {
	          date: this.format(latest, options),
	          value: this.format(value, options)
	        });
	        errors.push(err);
	      }

	      if (errors.length) {
	        return v.unique(errors);
	      }
	    }, {
	      parse: null,
	      format: null
	    }),
	    date: function(value, options) {
	      options = v.extend({}, options, {dateOnly: true});
	      return v.validators.datetime.call(v.validators.datetime, value, options);
	    },
	    format: function(value, options) {
	      if (v.isString(options) || (options instanceof RegExp)) {
	        options = {pattern: options};
	      }

	      options = v.extend({}, this.options, options);

	      var message = options.message || this.message || "is invalid"
	        , pattern = options.pattern
	        , match;

	      // Empty values are allowed
	      if (!v.isDefined(value)) {
	        return;
	      }
	      if (!v.isString(value)) {
	        return message;
	      }

	      if (v.isString(pattern)) {
	        pattern = new RegExp(options.pattern, options.flags);
	      }
	      match = pattern.exec(value);
	      if (!match || match[0].length != value.length) {
	        return message;
	      }
	    },
	    inclusion: function(value, options) {
	      // Empty values are fine
	      if (!v.isDefined(value)) {
	        return;
	      }
	      if (v.isArray(options)) {
	        options = {within: options};
	      }
	      options = v.extend({}, this.options, options);
	      if (v.contains(options.within, value)) {
	        return;
	      }
	      var message = options.message ||
	        this.message ||
	        "^%{value} is not included in the list";
	      return v.format(message, {value: value});
	    },
	    exclusion: function(value, options) {
	      // Empty values are fine
	      if (!v.isDefined(value)) {
	        return;
	      }
	      if (v.isArray(options)) {
	        options = {within: options};
	      }
	      options = v.extend({}, this.options, options);
	      if (!v.contains(options.within, value)) {
	        return;
	      }
	      var message = options.message || this.message || "^%{value} is restricted";
	      return v.format(message, {value: value});
	    },
	    email: v.extend(function(value, options) {
	      options = v.extend({}, this.options, options);
	      var message = options.message || this.message || "is not a valid email";
	      // Empty values are fine
	      if (!v.isDefined(value)) {
	        return;
	      }
	      if (!v.isString(value)) {
	        return message;
	      }
	      if (!this.PATTERN.exec(value)) {
	        return message;
	      }
	    }, {
	      PATTERN: /^[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i
	    }),
	    equality: function(value, options, attribute, attributes, globalOptions) {
	      if (!v.isDefined(value)) {
	        return;
	      }

	      if (v.isString(options)) {
	        options = {attribute: options};
	      }
	      options = v.extend({}, this.options, options);
	      var message = options.message ||
	        this.message ||
	        "is not equal to %{attribute}";

	      if (v.isEmpty(options.attribute) || !v.isString(options.attribute)) {
	        throw new Error("The attribute must be a non empty string");
	      }

	      var otherValue = v.getDeepObjectValue(attributes, options.attribute)
	        , comparator = options.comparator || function(v1, v2) {
	          return v1 === v2;
	        }
	        , prettify = options.prettify ||
	          (globalOptions && globalOptions.prettify) ||
	          v.prettify;

	      if (!comparator(value, otherValue, options, attribute, attributes)) {
	        return v.format(message, {attribute: prettify(options.attribute)});
	      }
	    },

	    // A URL validator that is used to validate URLs with the ability to
	    // restrict schemes and some domains.
	    url: function(value, options) {
	      if (!v.isDefined(value)) {
	        return;
	      }

	      options = v.extend({}, this.options, options);

	      var message = options.message || this.message || "is not a valid url"
	        , schemes = options.schemes || this.schemes || ['http', 'https']
	        , allowLocal = options.allowLocal || this.allowLocal || false;

	      if (!v.isString(value)) {
	        return message;
	      }

	      // https://gist.github.com/dperini/729294
	      var regex =
	        "^" +
	        // protocol identifier
	        "(?:(?:" + schemes.join("|") + ")://)" +
	        // user:pass authentication
	        "(?:\\S+(?::\\S*)?@)?" +
	        "(?:";

	      var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";

	      if (allowLocal) {
	        tld += "?";
	      } else {
	        regex +=
	          // IP address exclusion
	          // private & local networks
	          "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
	          "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
	          "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})";
	      }

	      regex +=
	          // IP address dotted notation octets
	          // excludes loopback network 0.0.0.0
	          // excludes reserved space >= 224.0.0.0
	          // excludes network & broacast addresses
	          // (first & last IP address of each class)
	          "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
	          "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
	          "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
	        "|" +
	          // host name
	          "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
	          // domain name
	          "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
	          tld +
	        ")" +
	        // port number
	        "(?::\\d{2,5})?" +
	        // resource path
	        "(?:[/?#]\\S*)?" +
	      "$";

	      var PATTERN = new RegExp(regex, 'i');
	      if (!PATTERN.exec(value)) {
	        return message;
	      }
	    }
	  };

	  validate.formatters = {
	    detailed: function(errors) {return errors;},
	    flat: v.flattenErrorsToArray,
	    grouped: function(errors) {
	      var attr;

	      errors = v.groupErrorsByAttribute(errors);
	      for (attr in errors) {
	        errors[attr] = v.flattenErrorsToArray(errors[attr]);
	      }
	      return errors;
	    },
	    constraint: function(errors) {
	      var attr;
	      errors = v.groupErrorsByAttribute(errors);
	      for (attr in errors) {
	        errors[attr] = errors[attr].map(function(result) {
	          return result.validator;
	        }).sort();
	      }
	      return errors;
	    }
	  };

	  validate.exposeModule(validate, this, exports, module, __webpack_require__(4));
	}).call(this,
	         true ? /* istanbul ignore next */ exports : null,
	         true ? /* istanbul ignore next */ module : null,
	        __webpack_require__(4));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var validate = __webpack_require__(2);

	validate.validators.features = function (value/*, options, key, attributes */) {
	  if (typeof (value) === 'undefined' || value === null)
	      return value;
	  if (!validate.isArray(value))
	      return 'needs to be a list of features';
	  for (var i = value.length - 1; i >= 0; i--) {
	    if (validate(value[i], feature))
	        return 'should have group and value keys';
	  }
	};

	validate.validators.isArray = function (value/*, options, key, attributes */) {
	  if (!validate.isArray(value))
	      return 'needs to be an array';
	};

	validate.validators.isObject = function (value/*, options, key, attributes */) {
	  if (!validate.isArray(value))
	      return 'needs to be an array';
	};

	var feature = {
	  group: { presence: true },
	  value: { presence: true },
	};

	var engagement = {
	  'label': { presence: true },
	  'content': { presence: true },
	  'boost': {
	    presence: false,
	    numericality: true,
	  },
	  'features': {
	    features: true,
	  },
	};

	var impression = {
	  'content_list': {
	    presence: true,
	    isArray: true,
	  },
	  'boost': {
	    presence: false,
	    numericality: true,
	  },
	  'features': {
	    features: true,
	  },
	};

	module.exports = {
	  engagementSpec: engagement,
	  impressionSpec: impression,
	};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	var errors = module.exports;

	var canCapture = (typeof Error.captureStackTrace === 'function');
	var canStack = !!(new Error()).stack;

	function ErrorAbstract(msg, constructor) {
	  this.message = msg;

	  Error.call(this, this.message);

	  if (canCapture) {
	    Error.captureStackTrace(this, constructor);
	  } else if (canStack) {
	    this.stack = (new Error()).stack;
	  } else {
	    this.stack = '';
	  }
	}

	errors._Abstract = ErrorAbstract;
	ErrorAbstract.prototype = new Error();

	errors.MissingUserId = function MissingUserId(msg) {
	  ErrorAbstract.call(this, msg);
	};

	errors.MissingUserId.prototype = new ErrorAbstract();

	errors.MisconfiguredClient = function MisconfiguredClient(msg) {
	  ErrorAbstract.call(this, msg);
	};

	errors.MisconfiguredClient.prototype = new ErrorAbstract();

	errors.InvalidInputData = function InvalidInputData(msg, errorInfo) {
	  ErrorAbstract.call(this, msg + ': \n\t' + errorInfo.join('\n\t'));
	};

	errors.InvalidInputData.prototype = new ErrorAbstract();

	errors.APIError = function APIError(msg) {
	  ErrorAbstract.call(this, msg);
	};

	errors.APIError.prototype = new ErrorAbstract();


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var request = __webpack_require__(8);
	var errors = __webpack_require__(6);

	var Client = function () {
	  this.initialize.apply(this, arguments);
	};

	Client.prototype = {
	  baseUrl: 'https://analytics.stream-io-api.com/analytics/v1.0/',

	  initialize: function (cfg) {
	    var configs = cfg || {};
	    if (!configs.apiKey || !configs.token) {
	      throw new errors.MisconfiguredClient('the client must be initialized with apiKey and token');
	    }

	    this.apiKey = configs.apiKey;
	    this.token = configs.token;
	  },

	  send: function (resourceName, eventData) {
	    var callback = function (err, response) {
	      if (err) {
	        throw err;
	      }

	      if (!/^2\d\d$/.test(response.statusCode)) {
	        throw new errors.APIError(response.responseText);
	      }

	    };

	    return this.post(
	      {
	        'url': this.baseUrl + resourceName + '/',
	        'body': eventData,
	      }, callback);
	  },

	  userAgent: function () {
	    var description = (this.node) ? 'node' : 'browser';
	    var version = 'unknown';
	    return 'stream-javascript-client-' + description + '-' + version;
	  },

	  enrichKwargs: function (kwargs) {
	    if (kwargs.qs === undefined) {
	      kwargs.qs = {};
	    }

	    kwargs.qs['api_key'] = this.apiKey;
	    kwargs.json = true;
	    kwargs.headers = {};
	    kwargs.headers['stream-auth-type'] = 'jwt';
	    kwargs.headers.Authorization = this.token;
	    kwargs.headers['X-Stream-Client'] = this.userAgent();
	    kwargs.timeout = 10 * 1000; // 10 seconds
	    return kwargs;
	  },

	  post: function (kwargs, callback) {
	    kwargs = this.enrichKwargs(kwargs);
	    kwargs.method = 'POST';
	    return request(kwargs, callback);
	  },
	};

	module.exports = Client;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	// Browser Request
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//     http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.

	var XHR = XMLHttpRequest
	if (!XHR) throw new Error('missing XMLHttpRequest')
	request.log = {
	  'trace': noop, 'debug': noop, 'info': noop, 'warn': noop, 'error': noop
	}

	var DEFAULT_TIMEOUT = 3 * 60 * 1000 // 3 minutes

	//
	// request
	//

	function request(options, callback) {
	  // The entry-point to the API: prep the options object and pass the real work to run_xhr.
	  if(typeof callback !== 'function')
	    throw new Error('Bad callback given: ' + callback)

	  if(!options)
	    throw new Error('No options given')

	  var options_onResponse = options.onResponse; // Save this for later.

	  if(typeof options === 'string')
	    options = {'uri':options};
	  else
	    options = JSON.parse(JSON.stringify(options)); // Use a duplicate for mutating.

	  options.onResponse = options_onResponse // And put it back.

	  if (options.verbose) request.log = getLogger();

	  if(options.url) {
	    options.uri = options.url;
	    delete options.url;
	  }

	  if(!options.uri && options.uri !== "")
	    throw new Error("options.uri is a required argument");

	  if(typeof options.uri != "string")
	    throw new Error("options.uri must be a string");

	  var unsupported_options = ['proxy', '_redirectsFollowed', 'maxRedirects', 'followRedirect']
	  for (var i = 0; i < unsupported_options.length; i++)
	    if(options[ unsupported_options[i] ])
	      throw new Error("options." + unsupported_options[i] + " is not supported")

	  options.callback = callback
	  options.method = options.method || 'GET';
	  options.headers = options.headers || {};
	  options.body    = options.body || null
	  options.timeout = options.timeout || request.DEFAULT_TIMEOUT

	  if(options.headers.host)
	    throw new Error("Options.headers.host is not supported");

	  if(options.json) {
	    options.headers.accept = options.headers.accept || 'application/json'
	    if(options.method !== 'GET')
	      options.headers['content-type'] = 'application/json'

	    if(typeof options.json !== 'boolean')
	      options.body = JSON.stringify(options.json)
	    else if(typeof options.body !== 'string' && options.body !== null)
	      options.body = JSON.stringify(options.body)
	  }
	  
	  //BEGIN QS Hack
	  var serialize = function(obj) {
	    var str = [];
	    for(var p in obj)
	      if (obj.hasOwnProperty(p)) {
	        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	      }
	    return str.join("&");
	  }
	  
	  if(options.qs){
	    var qs = (typeof options.qs == 'string')? options.qs : serialize(options.qs);
	    if(options.uri.indexOf('?') !== -1){ //no get params
	        options.uri = options.uri+'&'+qs;
	    }else{ //existing get params
	        options.uri = options.uri+'?'+qs;
	    }
	  }
	  //END QS Hack
	  
	  //BEGIN FORM Hack
	  var multipart = function(obj) {
	    //todo: support file type (useful?)
	    var result = {};
	    result.boundry = '-------------------------------'+Math.floor(Math.random()*1000000000);
	    var lines = [];
	    for(var p in obj){
	        if (obj.hasOwnProperty(p)) {
	            lines.push(
	                '--'+result.boundry+"\n"+
	                'Content-Disposition: form-data; name="'+p+'"'+"\n"+
	                "\n"+
	                obj[p]+"\n"
	            );
	        }
	    }
	    lines.push( '--'+result.boundry+'--' );
	    result.body = lines.join('');
	    result.length = result.body.length;
	    result.type = 'multipart/form-data; boundary='+result.boundry;
	    return result;
	  }
	  
	  if(options.form){
	    if(typeof options.form == 'string') throw('form name unsupported');
	    if(options.method === 'POST'){
	        var encoding = (options.encoding || 'application/x-www-form-urlencoded').toLowerCase();
	        options.headers['content-type'] = encoding;
	        switch(encoding){
	            case 'application/x-www-form-urlencoded':
	                options.body = serialize(options.form).replace(/%20/g, "+");
	                break;
	            case 'multipart/form-data':
	                var multi = multipart(options.form);
	                //options.headers['content-length'] = multi.length;
	                options.body = multi.body;
	                options.headers['content-type'] = multi.type;
	                break;
	            default : throw new Error('unsupported encoding:'+encoding);
	        }
	    }
	  }
	  //END FORM Hack

	  // If onResponse is boolean true, call back immediately when the response is known,
	  // not when the full request is complete.
	  options.onResponse = options.onResponse || noop
	  if(options.onResponse === true) {
	    options.onResponse = callback
	    options.callback = noop
	  }

	  // XXX Browsers do not like this.
	  //if(options.body)
	  //  options.headers['content-length'] = options.body.length;

	  // HTTP basic authentication
	  if(!options.headers.authorization && options.auth)
	    options.headers.authorization = 'Basic ' + b64_enc(options.auth.username + ':' + options.auth.password);

	  return run_xhr(options)
	}

	var req_seq = 0
	function run_xhr(options) {
	  var xhr = new XHR
	    , timed_out = false
	    , is_cors = is_crossDomain(options.uri)
	    , supports_cors = ('withCredentials' in xhr)

	  req_seq += 1
	  xhr.seq_id = req_seq
	  xhr.id = req_seq + ': ' + options.method + ' ' + options.uri
	  xhr._id = xhr.id // I know I will type "_id" from habit all the time.

	  if(is_cors && !supports_cors) {
	    var cors_err = new Error('Browser does not support cross-origin request: ' + options.uri)
	    cors_err.cors = 'unsupported'
	    return options.callback(cors_err, xhr)
	  }

	  xhr.timeoutTimer = setTimeout(too_late, options.timeout)
	  function too_late() {
	    timed_out = true
	    var er = new Error('ETIMEDOUT')
	    er.code = 'ETIMEDOUT'
	    er.duration = options.timeout

	    request.log.error('Timeout', { 'id':xhr._id, 'milliseconds':options.timeout })
	    return options.callback(er, xhr)
	  }

	  // Some states can be skipped over, so remember what is still incomplete.
	  var did = {'response':false, 'loading':false, 'end':false}

	  xhr.onreadystatechange = on_state_change
	  xhr.open(options.method, options.uri, true) // asynchronous
	  if(is_cors)
	    xhr.withCredentials = !! options.withCredentials

	  for (var key in options.headers)
	    xhr.setRequestHeader(key, options.headers[key])

	  xhr.send(options.body)
	  return xhr

	  function on_state_change(event) {
	    if(timed_out)
	      return request.log.debug('Ignoring timed out state change', {'state':xhr.readyState, 'id':xhr.id})

	    request.log.debug('State change', {'state':xhr.readyState, 'id':xhr.id, 'timed_out':timed_out})

	    if(xhr.readyState === 1) {
	      request.log.debug('Request started', {'id':xhr.id})
	    }

	    else if(xhr.readyState === 2)
	      on_response()

	    else if(xhr.readyState === 3) {
	      on_response()
	      on_loading()
	    }

	    else if(xhr.readyState === 4) {
	      on_response()
	      on_loading()
	      on_end()
	    }
	  }

	  function on_response() {
	    if(did.response)
	      return

	    did.response = true
	    request.log.debug('Got response', {'id':xhr.id, 'status':xhr.status})
	    clearTimeout(xhr.timeoutTimer)
	    xhr.statusCode = xhr.status // Node request compatibility

	    // Detect failed CORS requests.
	    if(is_cors && xhr.statusCode == 0) {
	      var cors_err = new Error('CORS request rejected: ' + options.uri)
	      cors_err.cors = 'rejected'

	      // Do not process this request further.
	      did.loading = true
	      did.end = true

	      return options.callback(cors_err, xhr)
	    }

	    options.onResponse(null, xhr)
	  }

	  function on_loading() {
	    if(did.loading)
	      return

	    did.loading = true
	    request.log.debug('Response body loading', {'id':xhr.id})
	    // TODO: Maybe simulate "data" events by watching xhr.responseText
	  }

	  function on_end() {
	    if(did.end)
	      return

	    did.end = true
	    request.log.debug('Request done', {'id':xhr.id})

	    xhr.body = xhr.responseText
	    if(options.json) {
	      try        { xhr.body = JSON.parse(xhr.responseText) }
	      catch (er) { return options.callback(er, xhr)        }
	    }

	    options.callback(null, xhr, xhr.body)
	  }

	} // request

	request.withCredentials = false;
	request.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;

	//
	// defaults
	//

	request.defaults = function(options, requester) {
	  var def = function (method) {
	    var d = function (params, callback) {
	      if(typeof params === 'string')
	        params = {'uri': params};
	      else {
	        params = JSON.parse(JSON.stringify(params));
	      }
	      for (var i in options) {
	        if (params[i] === undefined) params[i] = options[i]
	      }
	      return method(params, callback)
	    }
	    return d
	  }
	  var de = def(request)
	  de.get = def(request.get)
	  de.post = def(request.post)
	  de.put = def(request.put)
	  de.head = def(request.head)
	  return de
	}

	//
	// HTTP method shortcuts
	//

	var shortcuts = [ 'get', 'put', 'post', 'head' ];
	shortcuts.forEach(function(shortcut) {
	  var method = shortcut.toUpperCase();
	  var func   = shortcut.toLowerCase();

	  request[func] = function(opts) {
	    if(typeof opts === 'string')
	      opts = {'method':method, 'uri':opts};
	    else {
	      opts = JSON.parse(JSON.stringify(opts));
	      opts.method = method;
	    }

	    var args = [opts].concat(Array.prototype.slice.apply(arguments, [1]));
	    return request.apply(this, args);
	  }
	})

	//
	// CouchDB shortcut
	//

	request.couch = function(options, callback) {
	  if(typeof options === 'string')
	    options = {'uri':options}

	  // Just use the request API to do JSON.
	  options.json = true
	  if(options.body)
	    options.json = options.body
	  delete options.body

	  callback = callback || noop

	  var xhr = request(options, couch_handler)
	  return xhr

	  function couch_handler(er, resp, body) {
	    if(er)
	      return callback(er, resp, body)

	    if((resp.statusCode < 200 || resp.statusCode > 299) && body.error) {
	      // The body is a Couch JSON object indicating the error.
	      er = new Error('CouchDB error: ' + (body.error.reason || body.error.error))
	      for (var key in body)
	        er[key] = body[key]
	      return callback(er, resp, body);
	    }

	    return callback(er, resp, body);
	  }
	}

	//
	// Utility
	//

	function noop() {}

	function getLogger() {
	  var logger = {}
	    , levels = ['trace', 'debug', 'info', 'warn', 'error']
	    , level, i

	  for(i = 0; i < levels.length; i++) {
	    level = levels[i]

	    logger[level] = noop
	    if(typeof console !== 'undefined' && console && console[level])
	      logger[level] = formatted(console, level)
	  }

	  return logger
	}

	function formatted(obj, method) {
	  return formatted_logger

	  function formatted_logger(str, context) {
	    if(typeof context === 'object')
	      str += ' ' + JSON.stringify(context)

	    return obj[method].call(obj, str)
	  }
	}

	// Return whether a URL is a cross-domain request.
	function is_crossDomain(url) {
	  // Fix for React Native. CORS does noet exist in that environment
	  if (! window.location) {
	    return false;
	  }

	  var rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/

	  // jQuery #8138, IE may throw an exception when accessing
	  // a field from window.location if document.domain has been set
	  var ajaxLocation
	  try { ajaxLocation = location.href }
	  catch (e) {
	    // Use the href attribute of an A element since IE will modify it given document.location
	    ajaxLocation = document.createElement( "a" );
	    ajaxLocation.href = "";
	    ajaxLocation = ajaxLocation.href;
	  }

	  var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || []
	    , parts = rurl.exec(url.toLowerCase() )

	  var result = !!(
	    parts &&
	    (  parts[1] != ajaxLocParts[1]
	    || parts[2] != ajaxLocParts[2]
	    || (parts[3] || (parts[1] === "http:" ? 80 : 443)) != (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443))
	    )
	  )

	  //console.debug('is_crossDomain('+url+') -> ' + result)
	  return result
	}

	// MIT License from http://phpjs.org/functions/base64_encode:358
	function b64_enc (data) {
	    // Encodes string using MIME base64 algorithm
	    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc="", tmp_arr = [];

	    if (!data) {
	        return data;
	    }

	    // assume utf8 data
	    // data = this.utf8_encode(data+'');

	    do { // pack three octets into four hexets
	        o1 = data.charCodeAt(i++);
	        o2 = data.charCodeAt(i++);
	        o3 = data.charCodeAt(i++);

	        bits = o1<<16 | o2<<8 | o3;

	        h1 = bits>>18 & 0x3f;
	        h2 = bits>>12 & 0x3f;
	        h3 = bits>>6 & 0x3f;
	        h4 = bits & 0x3f;

	        // use hexets to index into b64, and append result to encoded string
	        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	    } while (i < data.length);

	    enc = tmp_arr.join('');

	    switch (data.length % 3) {
	        case 1:
	            enc = enc.slice(0, -2) + '==';
	        break;
	        case 2:
	            enc = enc.slice(0, -1) + '=';
	        break;
	    }

	    return enc;
	}
	module.exports = request;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var each = __webpack_require__(10);

	module.exports = function (StreamAnalytics) {
	  var loaded = window.StreamAnalytics || null,
	      cached = window._StreamAnalytics || null,
	      clients;

	  if (loaded && cached) {
	    clients = cached.clients || {};

	    each(clients, function (client/*, id */) {

	      each(StreamAnalytics.prototype, function (method, key) {
	        loaded.prototype[key] = method;
	      });

	      // Run config
	      if (client._config) {
	        client.configure.call(client, client._config);
	      }

	      // Run setUser
	      if (client._setUser) {
	        each(client._setUser, function (args) {
	          client.setUser.apply(client, args);
	        });
	      }

	      // Send Queued Events
	      if (client._trackImpression) {
	        each(client._trackImpression, function (obj) {
	          client.trackImpression.apply(client, obj);
	        });
	      }

	      // Send Queued Events
	      if (client._trackEngagement) {
	        each(client._trackEngagement, function (obj) {
	          client.trackEngagement.apply(client, obj);
	        });
	      }

	      // unset config
	      each(['_config', '_setUser', '_trackEngagement', '_trackImpression'], function (name) {
	        if (client[name]) {
	          client[name] = undefined;
	          try {
	            delete client[name];
	          } catch (e) {
	              // do nothing
	          }
	        }
	      });

	    });

	  }

	  window._StreamAnalytics = undefined;
	  try {
	    delete window['_StreamAnalytics'];
	  } catch (e) {
	    // do nothing
	  }
	};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	module.exports = function (o, cb, s) {
	  var n;
	  if (!o) {
	    return 0;
	  }

	  s = !s ? o : s;
	  if (o instanceof Array) {
	    // Indexed arrays, needed for Safari
	    for (n = 0; n < o.length; n++) {
	      if (cb.call(s, o[n], n, o) === false) {
	        return 0;
	      }
	    }
	  } else {
	    // Hashtables
	    for (n in o) {
	      if (o.hasOwnProperty(n)) {
	        if (cb.call(s, o[n], n, o) === false) {
	          return 0;
	        }
	      }
	    }
	  }

	  return 1;
	};


/***/ })
/******/ ])
});
;