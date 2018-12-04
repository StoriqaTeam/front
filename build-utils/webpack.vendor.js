// webpack.vendor.js
const webpack = require('webpack');
const path = require('path');

module.exports = {
 
  mode: 'production',
  entry: {
    // create two library bundles, one with jQuery and
    // another with Angular and related libraries
    vendor: [
      "axios",
      "body-parser",
      "classnames",
      "compression",
      "found",
      "found-relay",
      "jwt-decode",
      "lodash.debounce",
      "moment",
      "morgan",
      "prop-types",
      "qrcode.react",
      "ramda",
      "react",
      "react-autocomplete",
      "react-autosize-textarea",
      "react-datepicker",
      "react-dom",
      "react-error-boundary",
      "react-redux",
      "react-relay",
      "react-responsive",
      "redux",
      "redux-logger",
      "redux-thunk",
      "relay-runtime",
      "resize-observer-polyfill",
      "smoothscroll-polyfill",
      "xss",
    ],
  
  },

  output: {
    filename: '[name].dll.js',
    path: path.resolve('./dll'),
    // The name of the global variable which the library's
    // require() function will be assigned to
    library: '[name]',
  },

  plugins: [
    new webpack.DllPlugin({
      // context: path.join(__dirname, '..'),
      path: `${path.resolve('./dll')}/[name]-manifest.json`,
      name: '[name]`'
    }),
  ],
};
