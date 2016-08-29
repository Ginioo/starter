var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: [
    './src/index'
  ],
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: '/public/assets/js/',
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
  }
};
