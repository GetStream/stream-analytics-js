var request = require('request');
var errors = require('./errors.js');

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
