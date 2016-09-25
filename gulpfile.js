'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');

const rollup = require('gulp-rollup');
const babel = require('rollup-plugin-babel');
const eslint = require('rollup-plugin-eslint');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');

const rename = require('gulp-rename');
const scssLint = require('gulp-scss-lint');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');

const config = {
    js : {
        src : ['src/js/**/**.js'],
        dest : 'build/js/',
        entry : './src/js/imagecrop.js',
    },
    example : {
        src : ['src/example/**/**.js', 'build/js/**/**.js'],
        dest : 'example/',
        entry : 'src/example/app.js'
    },
    scss : {
        src : ['src/sass/**/**.scss'],
        dest : 'build/css/',
    },
}

//
//  JS
//

    function doRollup (component) {
        return gulp.src(component.src)
        .pipe(
            rollup({
                entry: component.entry,
                format: 'iife',
                moduleName: 'ImageCropper',
                plugins: [
                    resolve({
                        jsnext: true,
                        main: true,
                        browser: true,
                    }),
                    commonjs(),
                    eslint('.eslintrc'),
                    babel({
                        presets: ['es2015-rollup'],
                        plugins : [
                            'check-es2015-constants',
                            'transform-minify-booleans',
                            'transform-property-literals',
                            'transform-member-expression-literals',
                            'transform-merge-sibling-variables'
                        ]
                    }),
                    uglify()
                ],
            })
        )
        .pipe(rename({
            suffix : '.min'
        }))
        .pipe(gulp.dest(component.dest));
    }

    gulp.task('js', () => doRollup(config.js));
    gulp.task('example', () => doRollup(config.example));

//
//  SCSS
//

    gulp.task('scss', () => gulp.src(config.scss.src)
        .pipe(scssLint({
            config : '.scss-lint.yml'
        }))
        .pipe(sass({
            outputStyle : 'compressed'
        }))
        .pipe(autoprefixer())
        .pipe(rename({
            suffix : '.min'
        }))
        .pipe(gulp.dest(config.scss.dest))
    );

    gulp.task('serve', (cb) => nodemon({
        script : 'server.js',
        ext : 'js css html',
        watch : [
            'server'
        ]
    }));

//
//  WATCH
//

    gulp.task('watch', (cb) => {
        livereload.listen();
        gulp.watch(config.scss.src, ['scss']);
        gulp.watch(config.js.src, ['js', 'example']);
        gulp.watch(config.example.src, ['js', 'example'])
        cb();
    });

    gulp.task('build', [], (cb) => runSequence('js', 'scss', 'example', cb));

    //  Wrapper task for building all files, and watching for changes.
    gulp.task('default', (cb) => runSequence('build', 'watch', 'serve', cb));