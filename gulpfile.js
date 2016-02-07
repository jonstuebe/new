var gulp = require('gulp'),
    notify = require('gulp-notify'),
    minifyCSS = require('gulp-minify-css'),
    changed = require('gulp-changed'),
    rename = require("gulp-rename"),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    bourbon = require('node-bourbon'),
    neat = require('node-neat'),
    eyeglass = require("eyeglass"),
    // babel = require('gulp-babel'), // needed for react
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    plumber = require('gulp-plumber');

var paths = {
    scripts: './assets/js/src/**/*.js',
    styles: './assets/sass/**/*.scss',
    output: {
        scripts: './assets/js',
        styles: './assets/css'
    }
}

gulp.task('styles.prod', function(){

	gulp.src(paths.styles)
    	.pipe(changed(paths.output.styles, { extension: '.css' }))
    	.pipe(sass(eyeglass()).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(minifyCSS({
        	keepSpecialComments: 0
        }))
        .pipe(rename({
        	extname: '.min.css'
        }))
        .pipe(notify("production sass compiled"))
        .pipe(gulp.dest(paths.output.styles));

});

gulp.task('styles', function()
{
    gulp.src(paths.styles)
        .pipe(changed(paths.output.styles, { extension: '.css' }))
        .pipe(sourcemaps.init())
        .pipe(sass(eyeglass({ sourceMap: true })).on('error', sass.logError))
        // .pipe(autoprefixer({
        //     browsers: ['last 3 versions']
        // }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.output.styles))
        .pipe(browserSync.stream())
        .pipe(notify("sass compiled"));
});

gulp.task('react', function () {
    return gulp.src(paths.scripts)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.output.scripts))
        .pipe(notify("js compiled"));
});

gulp.task('watch', function()
{
    gulp.watch(paths.styles, ['styles']);
    // gulp.watch(paths.react, ['react']);
    // gulp.watch(paths.react).on('change', browserSync.reload);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('default', ['watch', 'browser-sync']);
gulp.task('prod', ['styles.prod']);
