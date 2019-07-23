const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    animateGlobe: path.join(__dirname, 'src', 'animateGlobe', 'index.ts'),
    pointGlobe: path.join(__dirname, 'src', 'pointGlobe', 'index.js'),
    expandGlobe: path.join(__dirname, 'src', 'expandGlobe', 'index.js'),
    planeGlobe: path.join(__dirname, 'src', 'planeGlobe', 'index.js'),
    drawLine: path.join(__dirname, 'src', 'drawLine', 'index.js'),
    mapGlobe: path.join(__dirname, 'src', 'mapGlobe', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: "/build/",
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      resource: path.join(__dirname, 'resource'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
      },
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
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
          }
        ]
      },
      {
        test: /\.glsl$/,
        use: ['shader-loader']
      }
    ]
  },
  externals: {
    babylonjs: 'BABYLON',
    oimo: 'OIMO', //or true
    cannon: 'CANNON', //or true,
    react: 'var React',
    'react-dom': 'var ReactDOM',
    '@alife/aisc-widgets': 'var AiscWidgets',
    three: 'THREE',
    tween: 'TWEEN',
    mapboxgl: 'mapboxgl',
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.SourceMapDevToolPlugin({}),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: false
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify('true'),
    }),
  ],
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  }
};
