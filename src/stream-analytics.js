;(function (f) {
  // RequireJS
  if (typeof define === "function" && define.amd) {
    define("StreamAnalytics", [], function(){ return f(); });
  }
  // CommonJS
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  }
  // Global
  var g = null;
  if (typeof window !== "undefined") {
    g = window;
  } else if (typeof global !== "undefined") {
    g = global;
  } else if (typeof self !== "undefined") {
    g = self;
  }
  if (g) {
    g.StreamAnalytics = f();
  }
})(function() {
  "use strict";

  var _client = require('keen-js');

  function StreamAnalytics(config) {
    this.configure(config || {});
  }

  StreamAnalytics.prototype.configure = function(cfg){
    _client.configure(cfg);
  }

  module.exports = StreamAnalytics;
  return StreamAnalytics;
});