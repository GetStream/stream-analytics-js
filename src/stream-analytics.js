var validate = require('validate.js'),
  specs = require('./specs.js'),
  errors = require('./errors.js'),
  Client = require('./client.js');

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
  require('./async.js')(StreamAnalytics);

module.exports = StreamAnalytics;
