const webpack = require('webpack');
const paths = require('./paths');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const getClientEnvironment = require('./env');

const publicPath = paths.servedPath;
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

/* eslint-disable */
module.exports = {
  devtool: 'source-map',
  target: "node",
  entry: "./server/index.js",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "./server.js",
    publicPath: "/dist/",
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json',],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
        query: {
          cacheDirectory: false,
          presets: ['react', 'es2015', "react-app"]
        }
      },
    ]
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      ...env.stringified
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
/* eslint-enable */
