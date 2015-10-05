var validate = require('validate.js');
var specs = require('./specs.js');
var errors = require('./errors.js');
var Client = require('./client.js');

var StreamAnalytics = function(config) {
  this.configure(config || {});
};

StreamAnalytics.prototype.configure = function(cfg){
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

StreamAnalytics.Client = Client;
StreamAnalytics.errors = errors;

if (typeof(window) !== "undefined")
  require('./async.js')(StreamAnalytics);

module.exports = StreamAnalytics;
