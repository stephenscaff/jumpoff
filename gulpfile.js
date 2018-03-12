/**
 * Gulp Modules
 */
const gulp          = require('gulp'),
      plumber       = require('gulp-plumber'),
      newer         = require('gulp-newer'),
      imagemin      = require('gulp-imagemin'),
      uglify        = require('gulp-uglifyes'),
      jshint        = require('gulp-jshint'),
      sass          = require('gulp-sass'),
      autoprefixer  = require('gulp-autoprefixer'),
      handlebars    = require('gulp-compile-handlebars'),
      rename        = require('gulp-rename'),
      sourcemaps    = require('gulp-sourcemaps'),
      include       = require("gulp-include"),
      notify        = require('gulp-notify'),
      gls           = require('gulp-live-server'),

      // folder ref
      folder = {
        src: 'src/',
        build: 'dist/'
      };

// Server Port
const PORT = 8111;

/**
 * Compress Images
 */
gulp.task('images', () => {

  var out = folder.build + 'assets/landings/images/';

  return gulp.src(folder.src + 'assets/images/**/*')
    .pipe(newer(out))
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(out));
});

/**
 * SCSS Tasks
 */
gulp.task('scss', () => {

  var out = folder.build + 'assets/landings/css/';

  var onError = function(err) {
    notify.onError({
      title:    "CSS Error",
      subtitle: "Nah Bruv!",
      message:  "Error: <%= error.message %>",
      sound:    "Beep"
    })(err);

    this.emit('end');
  };

  return gulp.src(folder.src + 'assets/scss/*.scss')
  .pipe(plumber({errorHandler: onError}))
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'compressed',
    imagePath: 'assets/images/',
    precision: 3,
    errLogToConsole: true,
    autoprefixer: {add: true},
  }))
  .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(out));
});

/**
 * JavaScript
 */
gulp.task('js', () => {

  var out = folder.build + 'assets/landings/js/';

  var onError = function(err) {
    notify.onError({
      title:    "JS Error",
      subtitle: "Nah Bruv!",
      message:  "Error: <%= error.message %>",
      sound:    "Beep"
    })(err);

    this.emit('end');
  };
  return gulp.src(folder.src + 'assets/js/app.js')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(include())
    .pipe (uglify ({
      mangle: true,
      compress: true,
      output: { beautify: false }
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(out));
});

/**
 * Jquery
 */
gulp.task('jquery', () => {

  return gulp.src(folder.src + 'assets/js/jquery.js')
    .pipe(include())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(folder.build + 'assets/js/'));
});

/**
 * JS Hint
 */
gulp.task('jshint', () => {
  var onError = function(err) {
    notify.onError({
      title:    "JS Error",
      subtitle: "JS Hint!",
      message:  "Error: <%= error.message %>",
      sound:    "Beep"
    })(err);

    this.emit('end');
  };
  gulp.src(folder.src + 'assets/js/**/*')
    .pipe(jshint({ esversion: 6 }))
    .pipe(jshint.reporter('default'))
    .pipe(plumber({errorHandler: onError}));
});

/**
 * Handlebars Partials
 */
gulp.task('hbs', () => {

  return gulp.src(folder.src + 'pages/*.hbs')
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: [folder.src + 'partials']
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(folder.build));
});

/**
 * Live Server at port:
 */
gulp.task('serve', () => {
  var server = gls.static(folder.build, PORT);
  server.start();
});

/**
 * Runner
 * No jquery as of now
 */
gulp.task('run', ['images', 'hbs', 'scss', 'js', 'jshint', 'serve']);

/**
 * Watcher
 */
gulp.task('watch', () => {

  gulp.watch(folder.src + 'assets/images/**/*', ['images']);
  gulp.watch(folder.src + 'assets/scss/**/*', ['scss']);
  gulp.watch(folder.src + 'assets/js/**/*', ['js']);
  gulp.watch(folder.src + '**/*', ['hbs']);
  gulp.watch(folder.src + '**/*.html', ['serve'], (file) => {
    server.notify.apply(server, [file]);
  });
});

/**
 * Gulp Go
 */
gulp.task('default', ['run', 'watch']);
