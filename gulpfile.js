/**
 * Gulp File for Static projects using HBS partials.
 */
const gulp            = require('gulp'),
      autoprefixer    = require('gulp-autoprefixer'),
      babelify        = require('babelify'),
      browserify      = require('browserify'),
      buffer          = require('vinyl-buffer'),
      del             = require('del'),
      newer           = require('gulp-newer'),
      rename          = require('gulp-rename'),
      sass            = require('gulp-sass'),
      source          = require('vinyl-source-stream'),
      sourcemaps      = require('gulp-sourcemaps'),
      handlebars      = require('gulp-compile-handlebars'),
      terser          = require('gulp-terser'),
      gls             = require('gulp-live-server');

// Server Port
const PORT = 9992;

// Error handler
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// Cleanup
function clean() {
  return del(["dist/"]);
}


// CSS
function buildCSS() {
  return gulp.src('src/assets/scss/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'compressed',
    imagePath: 'assets/images/',
    precision: 3,
    errLogToConsole: true,
    autoprefixer: {add: true},
  }))
  .on('error', handleError)
  .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist/assets/css/'))
}

// Build JS
// uses browserify for js modules and babel for transpiling
function buildJS() {
  const bundler = browserify('src/assets/js/app.js').transform(
    'babelify',
    { presets: ['@babel/preset-env'] }
  )
  return bundler.bundle()
  .on('error', handleError)
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init())
    .pipe(terser({
      mangle: false,
      compress: false
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist/assets/js/'));
}


// HBS Partials
function buildHBS() {
  return gulp.src('src/pages/*.hbs')
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: ['src/partials']
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('dist/'));
}

// Templates
function buildTemplates() {
  return gulp.src('src/assets/templates/**/*')
    .pipe(newer('dist/assets/templates/'))
    .pipe(gulp.dest('dist/assets/templates/'))
}

// Images
function buildImages() {
  return gulp.src('src/assets/images/', { allowEmpty: true })
    .pipe(newer('dist/assets/images/'))
    .pipe(gulp.dest('dist/assets/images/'))
}

// Serve
function serve() {
  var server = gls.static('dist/', PORT);
  server.start();
}

// Watcher
function watch() {
  gulp.watch('src/assets/scss/**/*', buildCSS);
  gulp.watch('src/assets/js/**/*', buildJS);
  gulp.watch('src/assets/templates/**/*', buildTemplates);
  gulp.watch('src/**/*', buildHBS);
  gulp.watch('src/**/*.html', serve, (file) => {
    server.notify.apply(server, [file]);
  });
}

// Build
var build = gulp.parallel(
  clean,
  buildCSS,
  buildJS,
  buildHBS,
  buildTemplates,
  buildImages,
  serve,
  watch
);

gulp.task(build);
gulp.task('default', build);
