var webpack = require("webpack");
var path = require("path");

var HtmlWebpackPlugin = require('html-webpack-plugin');

var publicPath = '/starter/';

module.exports = {
  entry: [
    './src/index'
  ],
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: publicPath,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Starter',
      baseHref: publicPath,
      filename: 'index.html',
      template: 'templates/index.html',
      minify: false,
      hash: true,
      cache: true
    })
  ]
};
