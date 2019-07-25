const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const entry = {};
const pagePath = path.join(__dirname, 'src');
const rootChildren = fs.readdirSync(pagePath).filter(me => me !== 'components' && me !== 'utils');

/**
 * 递归生成 entry
 * @param {*} currentPath 当前路径
 * @param {*} childDirs   当前路径下的所有子目录
 */
function addEntryInPath(currentPath, childDirs) {
  childDirs.forEach((name) => {
    const handlingChild = path.join(currentPath, name);
    const stat = fs.lstatSync(handlingChild);
    // 以目录有没有 index.jsx 来判断是不是需要加到 entry 里
    const idxPath = path.join(handlingChild, 'index.js');
    const hasIndex = fs.existsSync(idxPath);
    if (hasIndex) {
      const relativePath = path.relative(pagePath, handlingChild);
      // webpack 的 entry 都是用 / 分隔的，使用 windows 的分隔符反而有问题
      const entryKey = relativePath.replace(new RegExp(_.escapeRegExp(path.sep), 'g'), '/');
      entry[entryKey] = idxPath;
    } else if (stat.isDirectory()) {
      addEntryInPath(handlingChild, fs.readdirSync(handlingChild));
    }
  });
}

addEntryInPath(pagePath, rootChildren);


module.exports = {
  mode: 'development',
  entry,
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
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'svg-url-loader',
          options: {},
        }
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
