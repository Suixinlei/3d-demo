const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    globe: path.join(__dirname, 'src', 'globe', 'index.ts'),
    idc: path.join(__dirname, 'src', 'idc', 'index.ts'),
    roomSelect: path.join(__dirname, 'src', 'roomSelect', 'index.ts'),
    room: path.join(__dirname, 'src', 'room', 'index.ts'),
    animateGlobe: path.join(__dirname, 'src', 'animateGlobe', 'index.ts'),
    planeGlobe: path.join(__dirname, 'src', 'planeGlobe', 'index.ts'),
    pointGlobe: path.join(__dirname, 'src', 'pointGlobe', 'index.js'),
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
