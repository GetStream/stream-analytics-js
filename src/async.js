var each = require('./utils/each');

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
