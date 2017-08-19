/** 
 * Gulp Modules 
 */
const gulp          = require('gulp'),
      plumber       = require('gulp-plumber'),
      newer         = require('gulp-newer'),
      imagemin      = require('gulp-imagemin'),
      uglify        = require('gulp-uglify'),
      jshint        = require('gulp-jshint'),
      sass          = require('gulp-sass'),
      autoprefixer  = require('gulp-autoprefixer'),
      cssnano       = require('gulp-cssnano'),
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

/** 
 * Compress Images 
 */
gulp.task('images', () => {

  var out = folder.build + 'assets/images/';
  
  return gulp.src(folder.src + 'assets/images/**/*')
    .pipe(newer(out))
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(out));
});


/** 
 * SCSS Tasks
 */
gulp.task('scss', () => {

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
  .pipe(sass({
    outputStyle: 'compressed',
    imagePath: 'assets/images/',
    precision: 3,
    errLogToConsole: true
  }))
  .pipe(sourcemaps.init())
  .pipe(autoprefixer())
  .pipe(cssnano({minifyFontValues: false,discardUnused: false}))
  .pipe(rename({ suffix: '.min' }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(folder.build + 'assets/css/'))
});


/** 
 * JavaScript
 */
gulp.task('js', () => {

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
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(folder.build + 'assets/js/'));
});


/** 
 * JS Hint
 */
gulp.task('jshint', () => {

  gulp.src(folder.src + 'assets/js/**/*')     
    .pipe(jshint())
    .pipe(plumber({errorHandler: onError}));
});


/** 
 * Handlebars Partials
 */
gulp.task('hbs', () => {
  
  return gulp.src('./src/pages/*.hbs')
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: ['./src/partials']
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('./dist'));
});



/** 
 * Live Server at port 8888
 */
gulp.task('serve', function() {
  var server = gls.static(folder.build, 8080);
  server.start();
});


/** 
 * Runner
 */
gulp.task('run', ['images', 'hbs', 'scss', 'js', 'serve']);


/**
 * Watcher
 */
gulp.task('watch', function() {

  gulp.watch(folder.src + 'assets/images/**/*', ['images']);
  gulp.watch(folder.src + 'assets/scss/**/*', ['scss']);
  gulp.watch(folder.src + 'assets/js/**/*', ['js']);
  gulp.watch(folder.src + '**/*', ['hbs']);
  gulp.watch(folder.src + '**/*.html', ['serve'], function (file) {
    server.notify.apply(server, [file]);
  });
});

/**
 * Gulp Go
 */
gulp.task('default', ['run', 'watch']);
