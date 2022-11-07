const path = require('path');

module.exports = (env = {}) => ({
    entry: ['./src/stream-analytics.ts'],

    mode: env.production ? 'production' : 'development',

    module: {
        rules: [{ test: /\.ts?$/, use: 'ts-loader', exclude: /node_modules/ }],
    },

    resolve: { extensions: ['.ts', '.js'] },

    output: {
        path: path.join(__dirname, 'dist', 'js'),
        publicPath: 'dist/',
        filename: env.production ? 'stream-analytics.min.js' : 'stream-analytics.js',
        chunkFilename: '[chunkhash].js',
        library: 'StreamAnalytics',
        libraryTarget: 'umd',
    },
});
