const path = require('path');

module.exports = {
    entry: ['./src/stream-analytics.js'],

    mode: 'production',

    output: {
        path: path.join(__dirname, 'dist', 'js'),
        publicPath: 'dist/',
        filename: 'stream-analytics.js',
        chunkFilename: '[chunkhash].js',
        library: 'StreamAnalytics',
        libraryTarget: 'umd',
    },

    resolve: {
        alias: {
            request: '@stream-io/browser-request',
        },
    },
};
