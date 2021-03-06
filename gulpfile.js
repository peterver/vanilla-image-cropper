'use strict';

const gulp = require('gulp');
const sync = require('browser-sync').create();

const rollup = require('gulp-rollup');
const babel = require('rollup-plugin-babel');
const { eslint } = require('rollup-plugin-eslint');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const { uglify } = require('rollup-plugin-uglify');

const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const config = {
    js : {
        src : ['src/js/**/**.js'],
        dest : 'dist/js/',
        entry : './src/js/imagecrop.js',
    },
    docs : {
        js : {
            src : ['src/docs/**/**.js'],
            dest : './docs/',
            entry : './src/docs/app.js'
        },
        scss : {
            src : ['src/docs/**/**.scss'],
            dest : './docs/',
        }
    },
    scss : {
        src : ['src/sass/**/**.scss'],
        dest : 'dist/css/',
    },
};

//
//  UTILITIES
//

    function doRollup (component) {
        return gulp.src(component.src)
        .pipe(
            rollup({
                input: component.entry,
                output: {
                    name: 'ImageCropper',
                    format: 'iife',
                },
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

    function doSCSS (component) {
        return gulp.src(component.src)
            .pipe(sass({
                outputStyle : 'compressed'
            }))
            .pipe(autoprefixer())
            .pipe(rename({
                suffix : '.min'
            }))
            .pipe(gulp.dest(component.dest));
    }

//
//  SOURCE TASKS
//

    gulp.task('js',         () => doRollup(config.js).pipe(gulp.dest('docs/dist')));
    gulp.task('scss',       () => doSCSS(config.scss).pipe(gulp.dest('docs/dist')));

    gulp.task('docs:js',    () => doRollup(config.docs.js));
    gulp.task('docs:scss',  () => doSCSS(config.docs.scss));
    gulp.task('docs',       gulp.series('docs:js', 'docs:scss'));

//
//  BUILD TASKS
//

    gulp.task('reload', () => sync.reload());

    gulp.task('dist', gulp.series('js', 'scss', 'docs'));

    gulp.task('serve', gulp.series('dist', () => {
        sync.init({
            server : ['./docs', './dist'],
            index : 'index.html',
            files : ['./dist/js/imagecrop.min.js', './dist/css/imagecrop.min.css', './docs/index.html', './docs/app.min.js']
        });

        gulp.watch(config.scss.src,         gulp.series('scss', 'reload'));
        gulp.watch(config.js.src,           gulp.series('js', 'reload'));
        gulp.watch(config.docs.js.src,      gulp.series('docs:js', 'reload'));
        gulp.watch(config.docs.scss.src,    gulp.series('docs:scss', 'reload'));
    }));

    //  Wrapper task for building all files, and watching for changes.
    gulp.task('default', gulp.series('serve'));
