var gulp = require("gulp");
var gutil = require("gulp-util");
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var del = require('del');
var webpack = require("webpack");
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var webpackConfig = Object.create(require("./webpack.config.js"));

var appPath = './';

gulp.task('clean', function(callback) {
  del([
    'build',
    '.htaccess',
    'index.css',
    'bundle.js',
    'index.html'
  ]);
  callback();
});

gulp.task("webpack", function(callback) {
  // run webpack
  webpack(webpackConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
      colors: true
    }));
    callback();
  });
});

gulp.task("style", function(callback) {
  gulp.src('src/style/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(appPath));

  callback();
});

gulp.task("build", ["clean", "webpack", "style"], function(callback) {
  gulp.src('build/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(appPath));

  gulp.src('build/**/*.html')
    .pipe(gulp.dest(appPath));

  const htaccessTemplate = fs.readFileSync(path.join(__dirname, 'templates', '.htaccess')).toString();
  const htaccess = _.template(htaccessTemplate)({REWRITE_BASE: webpackConfig.output.publicPath});
  fs.writeFile(path.join(__dirname, appPath, '.htaccess'), htaccess);

  gutil.log("[build]", 'successfully');
  callback();
});

var WebpackDevServer = require("webpack-dev-server");
gulp.task("dev", ["style"], function(callback) {
  // modify some webpack config options

  webpackConfig.devtool = "eval";
  webpackConfig.debug = true;
  // Start a webpack-dev-server
  new WebpackDevServer(webpack(webpackConfig), {
   publicPath: webpackConfig.output.publicPath,
   stats: {colors: true}
  })
  .listen(process.env.PORT, process.env.IP, function(err) {
    if (err) throw new gutil.PluginError("webpack-dev-server", err);
    gutil.log("[webpack-dev-server]", "http://" + process.env.IP + ":" + process.env.PORT + "/webpack-dev-server" + webpackConfig.output.publicPath + "index.html");

    gulp.watch('src/sass/**/*.scss', ["style"]);
  });
});
