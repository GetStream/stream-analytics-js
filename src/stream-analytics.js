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

  var validate = require('validate.js');
  var specs = require('./specs.js');
  var errors = require('./errors.js');

  function StreamAnalytics(config) {
    this.configure(config || {});
  }

  StreamAnalytics.prototype.configure = function(cfg){
    var Client = require('./client.js');
    this.client = new Client(cfg);
    this.userId = null;
  };

  StreamAnalytics.prototype.setUser = function(userId){
    this.userId = userId;
  };

  StreamAnalytics.prototype._sendEventFactory = function(resourceName, dataSpec){
    return function(eventData, callback){
      var errors = validate(eventData, dataSpec, {flatten: true});
      if (typeof(errors) === 'undefined') {
        this._sendEvent(resourceName, eventData, callback);
      } else if (typeof(callback) === 'function') {
        callback(errors);
      }
    };
  };

  StreamAnalytics.prototype._sendEvent = function(resourceName, eventData, callback){
    if (this._userId === null) {
      callback('userId was not set');
    }
    eventData.user_id = this.userId;
    return this.client.send(resourceName, eventData, callback);
  };

  StreamAnalytics.prototype.trackImpression = StreamAnalytics.prototype._sendEventFactory('impression', specs.impressionSpec);
  StreamAnalytics.prototype.trackEngagement = StreamAnalytics.prototype._sendEventFactory('engagement', specs.engagementSpec);

  module.exports = StreamAnalytics;
  return StreamAnalytics;
});
