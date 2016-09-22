var gulp = require('gulp'),
    gutil = require('gulp-util'),
    pkg = require('./package.json'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    stylish = require('gulp-jscs-stylish'),
    mocha = require('gulp-mocha'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    async = require('async');

var aws = require('gulp-awspublish'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    squash = require('gulp-remove-empty-lines'),
    strip = require('gulp-strip-comments'),
    transform = require('vinyl-transform');

var webpack = require("webpack");
var webpackConfig = require('./webpack.config.js');


function runSynchronized(tasks, callback){
    var sync = tasks.map(function(task){
        return function(callback){
            gulp.run(task, function(err){
                callback(err);
            });
        };
    });
    async.series(sync, callback);
}

// -------------------------
// Development tasks
// -------------------------

// check for jshint errors
gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(jshint({ lookup: true }))
    // .pipe(jscs())
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// run the mocha tests
gulp.task('mocha', function () {
    return gulp.src('./tests/index.js', {read: false})
        .pipe(mocha());
});

gulp.task('phantom', function () {
  return gulp
    .src('./tests/async.html')
    .pipe(mochaPhantomJS());
});

gulp.task('test', function () {
  runSynchronized(['lint', 'mocha', 'phantom']);
});

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./examples/*.html')
    .pipe(connect.reload());
  gulp.src('./dist/*.js')
    .pipe(connect.reload());
});

gulp.task('watch', ["build"], function() {
  gulp.watch('examples/*.html', ['build']);
  gulp.watch('lib/*.js', ['build']);
  gulp.watch('gulpfile.js', ['build']);
});

// -------------------------  
// Build tasks
// -------------------------

gulp.task("build", function() {
  runSynchronized(['build:webpack', 'build:optimize']);
});


gulp.task("build:webpack", function(callback) {
    var myConfig = Object.create(webpackConfig);
    webpack(myConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task("build:optimize", function(callback) {
  gulp.src('./dist/js/stream-analytics.js')
  .pipe(uglify())
  .pipe(rename('stream-analytics.min.js'))
  .pipe(gulp.dest('./dist/js/'));
});

// -------------------------
// Deployment task
// -------------------------

function awsPublisher() {
  if (!process.env.AWS_KEY || !process.env.AWS_SECRET) {
    throw 'AWS credentials are required!';
  }
  return aws.create({
      key: process.env.AWS_KEY,
      secret: process.env.AWS_SECRET,
      bucket: pkg.name
  });
}

gulp.task('s3publish', ['build'], function() {
  var publisher = awsPublisher();
  var cacheLife = (1000 * 60 * 60 * 24 * 365);
  var headers = {
    'Cache-Control': 'max-age=' + cacheLife + ', public',
    'Expires': new Date(Date.now() + cacheLife)
  };

  return gulp.src([
      './dist/js/stream-analytics.js',
      './dist/js/stream-analytics.min.js'
    ])
    .pipe(rename(function(path) {
      path.dirname += '/' + pkg['version'];
    }))
    .pipe(publisher.publish(headers, { force: true }))
    .pipe(publisher.publish(headers, { force: true }))
    .pipe(publisher.cache())
    .pipe(aws.reporter());
});
