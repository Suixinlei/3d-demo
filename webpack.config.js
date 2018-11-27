const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: "/build/",
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', 'json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ]
  },
  externals: {
    babylonjs: 'BABYLON',
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.SourceMapDevToolPlugin({}),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
      __DEV__: JSON.stringify('true'),
    }),
  ],
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  }
};
