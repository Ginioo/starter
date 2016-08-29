var gulp = require("gulp");
var gutil = require("gulp-util");
var uglify = require('gulp-uglify');
var webpack = require("webpack");
var del = require('del');

var webpackConfig = Object.create(require("./webpack.config.js"));

gulp.task('clean', function(callback) {
  del([
    'build'
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

gulp.task("build", ["clean", "webpack"], function(callback) {
  gulp.src('build/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'));

  callback();
});