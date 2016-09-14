'use strict';

//
//  SETUP
//

    const gulp = require('gulp');
    const browserify = require('browserify');
    const source = require('vinyl-source-stream');

    const $ = require('gulp-load-plugins')({
        pattern: ['*'],
        replaceString: /\bgulp[\-.]/
    });

    const onError = (err) => {
        $.notify({
            title: 'Gulp', message: 'Error: <%= err.message %>'
        });
    };

    const config = {
        eslintrc : '.eslintrc',
        scsslint : '.scss-lint.yml',
        js : {
            src : ['src/js/**/**.js'],
            dest : 'dist/js/',
        },
        scss : {
            src : ['src/sass/**/**.scss'],
            dest : 'dist/css/',
        },
        example : {
            src : 'example/src/**.js',
            dest : 'example/src/',
        },
    }

//
//  TASKS : JAVASCRIPT
//

    gulp.task('js', (cb) => gulp.src(config.js.src)
        .pipe($.plumber({
            errorHandler : onError
        }))
        .pipe($.eslint(config.eslintrc))
        .pipe($.eslint.format())
        .pipe($.babel({
            presets : ['es2015'],
            plugins : [
                'check-es2015-constants',
                'transform-minify-booleans',
                'transform-property-literals',
                'transform-member-expression-literals',
                'transform-merge-sibling-variables'
            ]
        }))
        .pipe($.uglify())
        .pipe($.rename({
            suffix : '.min'
        }))
        .pipe(gulp.dest(config.js.dest))
        .pipe(gulp.dest(config.example.dest))
    );

//
//  TASKS : SCSS
//

    gulp.task('scss', (cb) => gulp.src(config.scss.src)
        .pipe($.plumber({
            errorHandler : onError
        }))
        .pipe($.scssLint({
            config : config.scsslint
        }))
        .pipe($.sass({
            outputStyle : 'compressed'
        }))
        .pipe($.autoprefixer())
        .pipe($.rename({
            suffix : '.min'
        }))
        .pipe(gulp.dest(config.scss.dest))
    );

//  EXAMPLE

gulp.task('example', (cb) => browserify('example/src/app.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./example/'))
);

//  Just throw a quick notification in the CLI when everything was built.
gulp.task('build:notify', (cb) => {
    $.util.log($.util.colors.green('Files successfully parsed!'));
    cb();
});

//  Watch the necessary directories for changes and rebuild source files,
gulp.task('watch', (cb) => {
    gulp.watch(config.scss.src, ['scss']);
    gulp.watch(config.js.src, ['js']);
    gulp.watch(config.example.src, ['js', 'scss', 'example']);
    cb();
});

//  Build all files + notify user.
gulp.task('build', [], (cb) => $.runSequence(['js', 'scss'], ['build:notify'], cb));

//  Wrapper task for building all files, and watching for changes.
gulp.task('default', (cb) => $.runSequence('build', 'watch', cb));

//  Production task
gulp.task('production', (cb) => $.runSequence('build', cb));