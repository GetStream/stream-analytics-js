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

  var validate = require("validate.js");
  var specs = require('./specs.js');

  function StreamAnalytics(config) {
    this.configure(config || {});
  }

  StreamAnalytics.prototype.configure = function(cfg){
    var _Client = require('keen-js');
    this._client = new _Client();
    this._user = null;
    // cfg.host = 'analytics.getstream.io';
    this._client.configure(cfg);
  }

  StreamAnalytics.prototype.setUser = function(userId){
    this._user = userId;
  }

  StreamAnalytics.prototype._sendEventFactory = function(eventLabel, dataSpec){
    return function(eventData, callbackFn){
      var errors = validate(eventData, dataSpec, {flatten: true});
      if (typeof(errors) === 'undefined') {
        this._sendEvent(eventLabel, eventData, callbackFn);
      } else if (callbackFn !== null) {
        callbackFn(errors);
      }
    };
  }

  StreamAnalytics.prototype._sendEvent = function(eventLabel, eventData, callbackFn){
    this._client.addEvent(eventLabel, eventData, callbackFn);
  }

  StreamAnalytics.prototype._sendEvents = function(eventLabel, eventsData, callbackFn){
    var data = {};
    data[eventLabel] = eventsData;
    this._client.addEvents(data, callbackFn);
  }

  StreamAnalytics.prototype.trackImpressions = StreamAnalytics.prototype._sendEventFactory('impressions', specs.impressionSpec);
  StreamAnalytics.prototype.trackEngagement = StreamAnalytics.prototype._sendEventFactory('engagements', specs.engagementSpec);
  StreamAnalytics.prototype.updateUserData = StreamAnalytics.prototype._sendEventFactory('updateUserData', specs.userData);

  module.exports = StreamAnalytics;
  return StreamAnalytics;
});
