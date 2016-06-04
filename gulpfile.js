/**
 * Created by axetroy on 16-6-3.
 */

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var scripts = require('./scripts/meta');

gulp.task('script', function () {
  return gulp.src('index.js')
    .pipe($.webpack(require('./webpack.config')))
    .pipe(gulp.dest('.temp/'));
});

gulp.task('build', ['script'], function () {

  scripts.forEach(v=> {
    gulp.src([
      `src/${v.name}/meta.js`,
      `.temp/${v.name}.js`
    ]).pipe($.concat(`${v.name}.user.js`))
      .pipe(gulp.dest('dist'));
  });

});