const gulp = require('gulp');
const gutil = require('gulp-util');
const del = require('del');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

gulp.task('clean', (callback) => {
  del([
    'build',
  ]);
  callback();
});

gulp.task('webpack', (callback) => {
  const productionConfig = require('./webpack.config.js')('production');
  // run webpack
  webpack(productionConfig, function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      // output options
      colors: true
    }));
    callback();
  });
});

gulp.task('build', ['webpack'], (callback) => {
  const productionConfig = require('./webpack.config.js')('production');
  const htaccessTemplate = fs.readFileSync(path.join(__dirname, 'templates', '.htaccess')).toString();
  const htaccess = _.template(htaccessTemplate)({REWRITE_BASE: productionConfig.output.publicPath});
  fs.writeFile(path.join(__dirname, 'build', '.htaccess'), htaccess);

  gutil.log('[build]', 'successfully');
  callback();
});

var WebpackDevServer = require('webpack-dev-server');
gulp.task('dev', (callback) => {
  const developmentConfig = require('./webpack.config.js')('development');
  // Start a webpack-dev-server
  new WebpackDevServer(webpack(developmentConfig), {
    publicPath: developmentConfig.output.publicPath,
    stats: {colors: true}
  })
  .listen(developmentConfig.devServer.port, developmentConfig.devServer.host, (err) => {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log(
      '[webpack-dev-server]',
      'http://' + developmentConfig.devServer.host + ':' + developmentConfig.devServer.port + '/webpack-dev-server' + (developmentConfig.output.publicPath ? developmentConfig.output.publicPath : '/') + 'index.html'
    );
  });
  callback();
});
