var axios = require('axios');
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

    userAgent: function () {
        var description = this.node ? 'node' : 'browser';
        var version = 'unknown';
        return 'stream-javascript-client-' + description + '-' + version;
    },

    send: function (resourceName, eventData) {
        return axios({
            method: 'POST',
            url: this.baseUrl + resourceName + '/',
            data: eventData,
            timeout: 10 * 1000, // 10 seconds
            withCredentials: false, // making sure cookies are not sent
            headers: {
                'X-Stream-Client': this.userAgent(),
                'stream-auth-type': 'jwt',
                Authorization: this.token,
            },
            params: { api_key: this.apiKey },
        }).then(function (response) {
            if (!/^2\d\d$/.test(response.status + '')) throw new errors.APIError(response.body);
            return response.body;
        });
    },
};

module.exports = Client;
