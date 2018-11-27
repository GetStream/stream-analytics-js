var path = require("path");
var webpack = require("webpack");

module.exports = {
    context: __dirname + "/src",
    entry: {
        "stream-analytics": ["./stream-analytics.js"]
    },
    output: {
        path: path.join(__dirname, "dist", "js"),
        publicPath: "dist/",
        filename: "stream-analytics.js",
        chunkFilename: "[chunkhash].js",
        library: "StreamAnalytics",
        libraryTarget: "umd"
    },
    node: {
        console: false,
        Buffer: true,
        crypto: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
      alias: {
        'request': '@stream-io/browser-request'
      }
    },
    module: {
        loaders: [
            { test: /\.json$/,   loader: "json-loader" },
        ]
    }
};
