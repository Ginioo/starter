var gulp = require("gulp");
var gutil = require("gulp-util");
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var del = require('del');
var webpack = require("webpack");

var webpackConfig = Object.create(require("./webpack.config.js"));

gulp.task('clean', function(callback) {
  del([
    'build',
    'public'
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
  gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/assets/css'));

  callback();
});

gulp.task("build", ["clean", "webpack", "style"], function(callback) {
  gulp.src('build/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'));

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
    gutil.log("[webpack-dev-server]", "http://" + process.env.IP + ":" + process.env.PORT + "/webpack-dev-server/index.html");

    gulp.watch('src/sass/**/*.scss', ["style"]);
 });
});
