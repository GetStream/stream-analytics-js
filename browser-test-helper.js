// eslint-disable-next-line no-var
var pkg = require('./package.json');

window.version = pkg.version;

window.apiKey = process.env.STREAM_API_KEY;
window.token = process.env.STREAM_ANALYTICS_TOKEN;
window.baseUrl = process.env.STREAM_BASE_URL;
