const path = require("path");
const merge = require("webpack-merge");
const validate = require("webpack-validator");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const PATHS = {
  app: path.join(__dirname, "src", "index"),
  build: path.join(__dirname, "build"),
  baseHref: "/starter/"
};

const common = {
  // Entry accepts a path or an object of entries.
  // We"ll be using the latter form given it"s
  // convenient with more complex configurations.
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: "[name].js",
    publicPath: PATHS.baseHref
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Starter",
      baseHref: PATHS.baseHref,
      filename: "index.html",
      template: "templates/index.html",
      minify: false,
      hash: true,
      cache: true
    })
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  }
};

var config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
  case "build":
    config = merge(common, {});
    break;
  default:
    config = merge(common, {});
}

module.exports = validate(config);
