/* eslint-disable */
const webpackMerge = require('webpack-merge');

const loadPresets = require('./loadPresets');
const modeConfig = env => require(`./webpack.${env.mode}.js`)(env);

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) =>
  webpackMerge(
    modeConfig({ mode }),
    loadPresets({ mode, presets })
  );