const gulp = require('gulp'),
    gutil = require('gulp-util'),
    pkg = require('./package.json'),
    mocha = require('gulp-mocha'),
    eslint = require('gulp-eslint'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    aws = require('gulp-awspublish'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    webpack = require("webpack"),
    webpackConfig = require('./webpack.config.js');


// -------------------------
// Development tasks
// -------------------------

// check for jshint errors
gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
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

gulp.task('test', gulp.series('lint', 'mocha', 'phantom'));

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

// -------------------------  
// Build tasks
// -------------------------

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

gulp.task("build:optimize", function() {
  return gulp.src('./dist/js/stream-analytics.js')
  .pipe(uglify())
  .pipe(rename('stream-analytics.min.js'))
  .pipe(gulp.dest('./dist/js/'));
});

gulp.task("build", gulp.series('build:webpack', 'build:optimize'));


gulp.task('watch', gulp.series("build", function() {
  gulp.watch('examples/*.html', ['build']);
  gulp.watch('lib/*.js', ['build']);
  gulp.watch('gulpfile.js', ['build']);
}));

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

gulp.task('s3publish', gulp.series('build', function() {
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
}));
