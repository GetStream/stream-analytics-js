// eslint-disable-next-line no-var
window.pkg = require('./package.json');

window.__env__ = {
    API_KEY: process.env.API_KEY,
    ANALYTICS_TOKEN: process.env.ANALYTICS_TOKEN,
    BASE_URL: process.env.BASE_URL,
};
