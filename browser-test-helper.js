// eslint-disable-next-line no-var
window.pkg = require('./package.json');

window.env = {
    STREAM_API_KEY: process.env.STREAM_API_KEY,
    STREAM_ANALYTICS_TOKEN: process.env.STREAM_ANALYTICS_TOKEN,
    STREAM_BASE_URL: process.env.STREAM_BASE_URL,
};
