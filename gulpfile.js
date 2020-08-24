const gulp = require('gulp'),
    gutil = require('gulp-util'),
    mocha = require('gulp-mocha'),
    eslint = require('gulp-eslint'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js');

// -------------------------
// Development tasks
// -------------------------

// check for jshint errors
gulp.task('lint', function () {
    return gulp.src('./src/**/*.js').pipe(eslint()).pipe(eslint.format()).pipe(eslint.failAfterError());
});

// run the mocha tests
gulp.task('mocha', function () {
    return gulp.src('./tests/index.js', { read: false }).pipe(mocha());
});

gulp.task('phantom', function () {
    return gulp.src('./tests/async.html').pipe(mochaPhantomJS());
});

gulp.task('mochabrowser', function () {
    return gulp.src('./tests/index.html').pipe(mochaPhantomJS({ reporter: 'spec' }));
});

gulp.task('test', gulp.series('lint', 'mocha', 'mochabrowser', 'phantom'));

gulp.task('connect', function () {
    connect.server({
        root: './',
        livereload: true,
    });
});

gulp.task('html', function () {
    gulp.src('./examples/*.html').pipe(connect.reload());
    gulp.src('./dist/*.js').pipe(connect.reload());
});

// -------------------------
// Build tasks
// -------------------------

gulp.task('build:webpack', function (callback) {
    webpack(webpackConfig, function (err, stats) {
        if (err) throw new gutil.PluginError('webpack:build', err);
        gutil.log('[webpack:build]', stats.toString({ colors: true }));
        callback();
    });
});

gulp.task('build:optimize', function () {
    return gulp
        .src('./dist/js/stream-analytics.js')
        .pipe(uglify())
        .pipe(rename('stream-analytics.min.js'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('build', gulp.series('build:webpack', 'build:optimize'));

gulp.task(
    'watch',
    gulp.series('build', function () {
        gulp.watch('examples/*.html', ['build']);
        gulp.watch('lib/*.js', ['build']);
        gulp.watch('gulpfile.js', ['build']);
    })
);
