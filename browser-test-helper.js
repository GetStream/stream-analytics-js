// eslint-disable-next-line no-var
var pkg = require('./package.json');

window.version = pkg.version;

window.apiKey = process.env.API_KEY;
window.token = process.env.ANALYTICS_TOKEN;
window.baseUrl = process.env.BASE_URL;
