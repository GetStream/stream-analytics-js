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

gulp.task('deploy', ['build', 'aws']);

gulp.task('promote', ['aws'], function() {
  var links = ['stream-analytics', 'stream-analytics.min'];
  var publisher = awsPublisher();
  for (var i in links) {
    var f = links[i]; 
    require('fs').writeFile('dist/latest_' + f + '.js', '');
    var cacheLife = (1000 * 60 * 60 * 24 * 365);
    var headers = {
      'Cache-Control': 'max-age=' + cacheLife + ', public',
      'Expires': new Date(Date.now() + cacheLife),
    };
  }
  gulp.src([
      './dist/latest_stream-analytics.js',
      './dist/latest_stream-analytics.min.js'])
    .pipe(rename(function(path) {
      path.basename = path.basename.split('latest_')[1],
      path.dirname = 'latest'
      headers['WebsiteRedirectLocation'] = '/' + pkg['version'] + '/' + path.basename + '.js'
    }))
    .pipe(publisher.publish(headers, { force: true }))
    .pipe(publisher.cache())
    .pipe(aws.reporter());
});

gulp.task('aws', ['build'], function() {
  var publisher = awsPublisher();
  var cacheLife = (1000 * 60 * 60 * 24 * 365);
  var headers = {
    'Cache-Control': 'max-age=' + cacheLife + ', public',
    'Expires': new Date(Date.now() + cacheLife)
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
