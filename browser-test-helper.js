// eslint-disable-next-line no-var
var pkg = require('./package.json');

window.pkg = pkg;
window.STREAM_API_KEY = process.env.STREAM_API_KEY;
window.STREAM_ANALYTICS_TOKEN = process.env.STREAM_ANALYTICS_TOKEN;
