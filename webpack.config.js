const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');

module.exports = {
  mode: 'production',
  entry: slsw.lib.entries,
  target: 'node',
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '.webpack'),
    assetModuleFilename: '[file]',
    libraryTarget: 'commonjs',
  },
  resolve: {
    extensions: ['.ts', '.js', '.svg', '.ttf', '.png'],
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
};
