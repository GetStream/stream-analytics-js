(function (i, o) {
  i('StreamAnalytics', '../dist/js/stream-analytics.min.js', o);
})(function (t, h, x) {

  var methods, script, tag;
  // _StreamAnalytics cache
  x['_' + t] = {};
  // StreamAnalytics stub
  x[t] = function (e) {
    x['_' + t].clients = x['_' + t].clients || {};
    x['_' + t].clients[e.apiKey] = this;
    this._config = e;
  };

  var action = function (method) {
    return function () {
      this['_' + method] = this['_' + method] || [];
      this['_' + method].push(arguments);
      return this;
    };
  };

  methods = ['setUser', 'trackImpression', 'trackEngagement'];
  for (var i = 0; i < methods.length; i++) {
    var method = methods[i];
    x[t].prototype[method] = action(method);
  }

  script = document.createElement('script');
  script.async = !0;
  script.src = h;
  tag = document.getElementsByTagName('script')[0];
  tag.parentNode.insertBefore(script, tag);
}, this);
