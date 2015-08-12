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

  function djb2Code(str){
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    return hash;
  }

  StreamAnalytics.prototype.configure = function(cfg){
    var _Client = require('keen-js');
    this._client = new _Client();
    this._userId = null;
    this.sampling = cfg.sampling || 0.01;
    cfg.protocol = cfg.protocol || 'https';
    this._client.configure(cfg);
  };

  StreamAnalytics.prototype.setUser = function(userId){
    this._userId = userId;
  };

  StreamAnalytics.prototype._sendEventFactory = function(eventLabel, dataSpec){
    return function(eventData, callbackFn){
      var errors = validate(eventData, dataSpec, {flatten: true});
      if (typeof(errors) === 'undefined') {
        this._sendEvent(eventLabel, eventData, callbackFn);
      } else if (callbackFn !== null) {
        callbackFn(errors);
      }
    };
  };

  StreamAnalytics.prototype.isSampled = function(userId){
    var userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      userIdInt = djb2Code(String(userId));
    }
    return ((userIdInt % 100.0)/100) < this.sampling;
  };

  StreamAnalytics.prototype._sendEvent = function(eventLabel, eventData, callbackFn){
    if (this._userId === null) {
      throw new errors.MissingUserId('userId was not set.');
    }
    eventData.userId = this._userId;
    if (this.isSampled(this._userId)) {
      this._client.addEvent(eventLabel, eventData, callbackFn);
    }
  };

  StreamAnalytics.prototype.trackImpression = StreamAnalytics.prototype._sendEventFactory('impressions', specs.impressionSpec);
  StreamAnalytics.prototype.trackEngagement = StreamAnalytics.prototype._sendEventFactory('engagements', specs.engagementSpec);
  StreamAnalytics.prototype.updateUserData = StreamAnalytics.prototype._sendEventFactory('updateUserData', specs.userData);

  module.exports = StreamAnalytics;
  return StreamAnalytics;
});
