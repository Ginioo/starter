const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.devServer = function (options) {
  return {
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host || '0.0.0.0', // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({}),
      new webpack.LoaderOptionsPlugin({
        debug: true
      })
    ]
  };
};

exports.setupImages = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.(png|jpg|svg)$/,
          loader: "file-loader?name=img-[sha512:hash:base64:7].[ext]",
          include: paths
        }
      ],
    },
  };
};

exports.setupCSS = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          include: paths
        }
      ]
    }
  };
};

exports.extractCSS = function () {
  // Extract CSS during build
  return {
    module: {
      rules: [
        // We first replace our loaders with a single loader,
        // provided by the ExtractTextPlugin. We apply two filters to it,
        // first sass then css. We removed the styles one,
        // as we don’t want to embed styles directly in the page anymore.
        {
          test: /\.(scss|css)$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {loader: 'css-loader', options: {sourceMap: true}},
              {loader: 'sass-loader', options: {sourceMap: true}}
            ]
          }),
        }
      ]
    },
    plugins: [
      // Then, we effectively move the styles into public/styles.css,
      // embedding all the individual compiled chunks into a single file.
      new ExtractTextPlugin('[name].[chunkhash].css', {
        allChunks: true
      })
    ]
  };
};

exports.setupBabel = function () {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    }
  };
};

exports.setupJSON = function () {
  return {
    module: {
      rules: [
        {
          test: /\.json$/,
          loader: 'json-loader'
        }
      ]
    }
  };
};

exports.setEnvironmentVariable = function (key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugin: [
      new webpack.DefinePlugin(env)
    ]
  };
};

exports.minify = function () {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        // Don't beautify output (enable for neater output)
        beautify: false,

        // Eliminate comments
        comments: false,

        // Compression specific options
        compress: {
          warnings: false,

          // Drop `console` statements
          drop_console: true
        },

        // Mangling specific options
        mangle: {
          // Don't mangle $
          except: ['$'],

          // Don't care about IE8
          screw_ie8: true,

          // Don't mangle function names
          keep_fnames: true
        }
      })
    ]
  };
};

exports.extractBundle = function (options) {
  const entry = {};
  entry[options.name] = options.entries;

  return {
    // Define an entry point needed for splitting.
    entry: entry,
    plugins: [
      // Extract bundle and manifest files. Manifest is
      // needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest']
      })
    ]
  };
};

exports.clean = function (path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        // Without `root` CleanWebpackPlugin won't point to our
        // project and will fail to work.
        root: process.cwd()
      })
    ]
  };
};