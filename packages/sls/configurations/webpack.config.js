const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');

const { serviceDir } = slsw.lib.serverless || { serviceDir: '' };
const { isLocal } = slsw.lib.webpack || { isLocal: true };

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  devtool: 'source-map',
  mode: isLocal ? 'none' : 'production',
  externals: [
    { 'aws-sdk': 'commonjs aws-sdk' },
  ],

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            configFile: path.resolve(__dirname, 'babel.config.js'),
          },
        },
      },
      {
        test: /\.(jpe?g|png)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  output: {
    libraryTarget: 'commonjs2',
    path: `${serviceDir}/.temp/.webpack`,
    filename: '[name].js',

    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },

  plugins: [
    ...(isLocal ? [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
      }),
    ] : []),
  ],

  optimization: {
    usedExports: true,
    sideEffects: true,
  },

};
