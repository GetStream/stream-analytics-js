var gulp = require('gulp'),
    pkg = require('./package.json');

var aws = require('gulp-awspublish'),
    browserify = require('browserify'),
    compress = require('gulp-yuicompressor'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    squash = require('gulp-remove-empty-lines'),
    strip = require('gulp-strip-comments'),
    transform = require('vinyl-transform');

// -------------------------
// Development tasks
// -------------------------

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

gulp.task('watch', ['connect', 'build'], function() {
  gulp.watch('examples/*.html', ['build']);
  gulp.watch('src/**/*.js', ['build']);
  gulp.watch('src/*.js', ['build']);
  gulp.watch('gulpfile.js', ['build']);
});

// -------------------------  
// Build tasks
// -------------------------

gulp.task('build', ['build:browserify', 'build:minify', 'html']);

gulp.task('build:browserify', function() {
  return gulp.src([
      './src/stream-analytics.js',
    ])
    .pipe(transform(function(filename) {
      var b = browserify(filename);
      return b.bundle();
    }))
    .pipe(strip({ line: true }))
    .pipe(squash())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build:minify', ['build:browserify'], function(){
  return gulp.src([
      './dist/stream-analytics.js',
    ])
    .pipe(compress({ type: 'js' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/'));
});

// -------------------------
// Deployment task
// -------------------------

gulp.task('deploy', ['build', 'aws']);

gulp.task('aws', ['build'], function() {

  if (!process.env.AWS_KEY || !process.env.AWS_SECRET) {
    throw 'AWS credentials are required!';
  }

  var publisher = aws.create({
    key: process.env.AWS_KEY,
    secret: process.env.AWS_SECRET,
    bucket: pkg.name
  });

  var cacheLife = (1000 * 60 * 60 * 24 * 365);

  var headers = {
    'Cache-Control': 'max-age=' + cacheLife + ', public',
    'Expires': new Date(Date.now() + cacheLife).toUTCString()
  };

  return gulp.src([
      './dist/stream-analytics.js',
      './dist/stream-analytics.min.js'
    ])
    .pipe(rename(function(path) {
      path.dirname += '/' + pkg['version'];
    }))
    .pipe(aws.gzip())
    .pipe(publisher.publish(headers, { force: true }))
    .pipe(publisher.cache())
    .pipe(aws.reporter());

});
