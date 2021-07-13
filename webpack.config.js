const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const CopyPlugin = require('copy-webpack-plugin');

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
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './jest.config.js',
          to: './jest.config.js',
        },
        {
          from: './src/web.test.js',
          to: './src/web.test.js',
        },
      ],
    }),
  ],
};
