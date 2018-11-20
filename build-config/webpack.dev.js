const webpackMerge = require('webpack-merge');
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
// const { DllBundlesPlugin } = require('webpack-dll-bundles-plugin');

const paths = require('./paths');

const commonConfig = require('./webpack.common');

module.exports = webpackMerge(commonConfig, {

    mode: 'development',

    context: require('path').resolve(__dirname, '..'),
    // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
    // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
    devtool: 'cheap-module-source-map',
    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in JS bundle.
    // The first two entry points enable "hot" CSS and auto-refreshes for JS.
    entry: [
      // for HMR
      'webpack-hot-middleware/client',
      // We ship a few polyfills by default:
      // require.resolve('./polyfills'),
      // Finally, this is your app's code:
      paths.appIndexJs,
      // We include the app code last so that if there is a runtime error during
      // initialization, it doesn't blow up the WebpackDevServer client, and
      // changing JS code would still trigger a refresh.
    ]

  });