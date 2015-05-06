var gulp = require('gulp'),
	notify = require('gulp-notify'),
	minifyCSS = require('gulp-minify-css'),
	changed = require('gulp-changed'),
	rename = require("gulp-rename"),
	sourcemaps   = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    gulpFilter = require('gulp-filter'),
    mainBowerFiles = require('main-bower-files'),
    bowerNormalizer = require('gulp-bower-normalize'),
    del = require('del');

var paths = {
	scripts: './assets/js/**/*.js',
	styles: './assets/sass/**/*.scss',
	output: {
		styles: './assets/css'
	}
}

var includePaths = [
    './bower_components/foundation/scss/'
];

gulp.task('styles.prod', function(){

	gulp.src(paths.styles)
        .pipe(plumber())
    	// .pipe(changed(paths.output.styles, { extension: '.css' }))
    	.pipe(sass({
    		includePaths: neat.includePaths
        }))
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
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err.message);
                this.emit('end');
            }
        }))
    	// .pipe(sourcemaps.init())
    	.pipe(sass({
    		includePaths: includePaths,
    		// sourceMap: true
        }))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        // .pipe(sourcemaps.write('.'))
        .pipe(notify("sass compiled"))
        .pipe(gulp.dest(paths.output.styles));
});

gulp.task('watch', function()
{
	gulp.watch(paths.styles, ['styles']);
});

gulp.task('bower', function(){

    del([
        'assets/vendor/**'
    ], function(){

        var jsFilter = gulpFilter('**/*.js'),
            cssFilter = gulpFilter('**/*.css');

        gulp.src(mainBowerFiles(), { base: 'bower_components' })
            .pipe(bowerNormalizer({ bowerJson: './bower.json' }))
            .pipe(gulp.dest('./assets/vendor'));

    });

});

gulp.task('bower-prod', function(){

    del([
        'assets/vendor/**'
    ], function(){

        var jsFilter = gulpFilter('**/*.js'),
            cssFilter = gulpFilter('**/*.css');

        gulp.src(mainBowerFiles(), { base: 'bower_components' })
            .pipe(bowerNormalizer({ bowerJson: './bower.json' }))
            .pipe(jsFilter)
            .pipe(uglify())
            .pipe(jsFilter.restore())
            .pipe(cssFilter)
            .pipe(minifyCSS())
            .pipe(cssFilter.restore())
            .pipe(gulp.dest('./assets/vendor'));

    });

});

gulp.task('default', ['styles', 'watch']);
gulp.task('prod', ['styles.prod']);