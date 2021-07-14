const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

const tests = glob
  .sync('./src/tests/*.test.+(ts|js)')
  .reduce((accumulator, currentValue) => {
    const entry = currentValue
      .replace(/^.*(?=src)/, '')
      .replace(/\.(js|ts)$/, '');
    accumulator[entry] = currentValue;
    return accumulator;
  }, {});

module.exports = {
  mode: 'production',
  entry: {
    ...slsw.lib.entries,
    ...tests,
  },
  target: 'node',
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '.webpack'),
    libraryTarget: 'commonjs',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: ['./jest.config.js'],
    }),
    new webpack.DefinePlugin({
      'process.env.PRODUCTION': !slsw.lib.webpack.isLocal,
    }),
  ],
};
