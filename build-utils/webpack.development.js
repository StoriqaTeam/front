const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const RelayCompilerWebpackPlugin = require('relay-compiler-webpack-plugin');

// const { DllBundlesPlugin } = require('webpack-dll-bundles-plugin');

const paths = require('./paths');
const getClientEnvironment = require('./env');

const publicUrl = '';

// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

const handler = (percentage, message, ...args) => {
  // e.g. Output each progress message directly to the console:
  console.info(percentage, message, ...args);
};

module.exports = (mode) => {
  const commonConfig = require('./webpack.common')();

  return webpackMerge(commonConfig, {

    mode: 'development',
    
    //context: require('path').resolve(__dirname, '..'),
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
    ],
    output: {
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: true,
      // This does not produce a real file. It's just the virtual path that is
      // served by WebpackDevServer in development. This is the JS bundle
      // containing code from all our entry points, and the Webpack runtime.
      filename: 'static/js/bundle.js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: 'static/js/[name].chunk.js',
      // This is the URL that app is served from. We use "/" in development.
      publicPath: '/',
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    plugins: [
      new webpack.ProgressPlugin(handler),
      new HtmlWebpackPlugin({
        alwaysWriteToDisk: true,
        template: path.resolve(__dirname, 'templates/dev.html'),
        filename: 'index.dev.html',
      }),
      new HtmlWebpackHarddiskPlugin({
        outputPath: path.resolve(__dirname, 'templates')
      }), 
      new HardSourceWebpackPlugin.ExcludeModulePlugin([
        {
          // HardSource works with mini-css-extract-plugin but due to how
          // mini-css emits assets, assets are not emitted on repeated builds with
          // mini-css and hard-source together. Ignoring the mini-css loader
          // modules, but not the other css loader modules, excludes the modules
          // that mini-css needs rebuilt to output assets every time.
          test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
        },
      ]),
      new HardSourceWebpackPlugin(),
      // for HMR
      new webpack.HotModuleReplacementPlugin(),
      // for HMR
      new webpack.NoEmitOnErrorsPlugin(),
       // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebookincubator/create-react-app/issues/240
      new CaseSensitivePathsPlugin(),
      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for Webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      // See https://github.com/facebookincubator/create-react-app/issues/186
      new WatchMissingNodeModulesPlugin(paths.appNodeModules),
      // Relay-compile as step of build
      new RelayCompilerWebpackPlugin({
        schema: path.resolve(__dirname, '../src/relay/schema.json'),
        src: path.resolve(__dirname, '../src'),
      }),
    ],

  });
};
