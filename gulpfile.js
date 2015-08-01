/*
 * Requirements and plugins
 */

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var $ = require('gulp-load-plugins')({
    pattern: ['*'],
    replaceString: /\bgulp[\-.]/
});

var paths = {
    js          : ['src/js/**/**.js'],
    js_dest     : 'build/',
    scss        : ['src/sass/**/**.scss'],
    scss_dest   : 'build/',
    example     : 'example/src/**.js',
    example_dest: 'example/src/'
};

var onError = function (err) {
  $.notify({title: 'Gulp', message: 'Error: <%= err.message %>'})(err);
};

//  Javascript
gulp.task('js', function (cb) {
  return gulp.src(paths.js)
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'))
    .pipe($.notify({title: 'jshint', message: 'jshint - passed'}))
    .pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.js_dest))
    .pipe(gulp.dest(paths.example_dest));
});

//  SASS
gulp.task('scss', function (cb) {
  return gulp.src(paths.scss)
    .pipe($.plumber({errorHandler: onError}))
    .pipe($.scssLint({'config': '.scss-lint.yml'}))
    .pipe($.sass({outputStyle: 'compressed'}))
    .pipe($.autoprefixer())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.scss_dest));
});

//  EXAMPLE

gulp.task('example', function (cb) {
  return browserify('example/src/app.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./example/'));
});

//  Just throw a quick notification in the CLI when everything was built.
gulp.task('build:notify', function (cb) {
    $.util.log($.util.colors.green('Files successfully parsed!'));
    cb();
});

//  Build all files + notify user.
gulp.task('build', [], function (cb) {
    $.runSequence(['js', 'scss'], ['build:notify'], cb);
});

//  Watch the necessary directories for changes and rebuild source files,
gulp.task('watch', function (cb) {
    gulp.watch(paths.scss, ['scss']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.example, ['js', 'scss', 'example']);
    $.util.log($.util.colors.magenta('Watching for changes…'));
    cb();
});

//  Wrapper task for building all files, and watching for changes.
gulp.task('default', function (cb) {
    $.runSequence('build', 'watch', cb);
});