const path = require("path");
const merge = require("webpack-merge");
const validate = require("webpack-validator");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const parts = require('./libs/parts');

const PATHS = {
  app: path.join(__dirname, "src", "index"),
  appStyle: path.join(__dirname, "src", "style"),
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
  ]
};

var config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
  case "build":
    config = merge(
      common,
      parts.setupCSS(PATHS.appStyle),
      parts.setupBabel()
    );
    break;
  default:
    config = merge(
      common,
      parts.setupCSS(PATHS.appStyle),
      parts.setupBabel(),
      parts.devServer({
        // Customize host/port here if needed
        host: process.env.IP,
        port: process.env.PORT
      })
    );
}
console.log(config.module);
module.exports = validate(config);
