var gulp         = require('gulp');

var stylus       = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS    = require('gulp-minify-css');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var concat       = require('gulp-concat');
var imagemin     = require('gulp-imagemin');
var newer        = require('gulp-newer');
var zip          = require('gulp-zip');
var pngquant     = require('imagemin-pngquant');
var svgo         = require('imagemin-svgo');
var gifsicle     = require('imagemin-gifsicle');
var jpegtran     = require('imagemin-jpegtran');
var browserSync  = require('browser-sync');
var plumber      = require('gulp-plumber');

// file source and destination variables

// HTML files
var htmlSrc = 'source/**/*.html';
var htmlDest = 'build';

// Images
var imgSrc = 'source/img/**';
var imgDest = 'build/img';

// Stylesheets
var cssSrc = 'source/stylus/*.styl';
var cssDest = 'build/css';

// Sripts
var jsSrc = 'source/js/*.js';
var jsDest = 'build/js';
var jsVendorSrc = ['source/js/vendor/jquery*', 'source/js/vendor/*.js'];
var jsVendorDest = 'build/js/vendor';

// Name of ready-to-upload archive
var zipName = 'archive.zip'

// Handle errors
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// Static Server + watching stylus/html/js/image files
gulp.task('serve', ['html', 'images', 'scripts', 'scripts-vendor', 'css'], function() {

  browserSync.init({
    server: "./build"
  });

  gulp.watch("source/img/*", ['images']);
  gulp.watch("source/stylus/**/*.styl", ['css']);
  gulp.watch("source/*.html", ['html']);
  gulp.watch("source/js/*.js", ['scripts']);
  gulp.watch("source/js/vendor/*.js", ['scripts-vendor']);
});

// Compile Stylus into CSS, add vendor prefixes & auto-inject into browser
gulp.task('css', function() {
  return gulp.src(cssSrc)
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(newer(cssDest))
    .pipe(stylus({
      compress: false,
      paths: ['source/stylus']
    }))
    .pipe(autoprefixer({
      browsers: ['last 4 versions', 'ie 8', 'ie 9']
    }))
    .pipe(rename('master.css'))
    .pipe(gulp.dest(cssDest))
    .pipe(browserSync.stream());
});

// Concatenate scripts (we don't minify these)
gulp.task('scripts', function() {
  gulp.src(jsSrc)
    .pipe(newer(jsSrc))
    .pipe(concat('main.js')) // concat pulls all our files together before minifying them
    .pipe(gulp.dest(jsDest))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Copy and optimise images from source to build
gulp.task('images', function() {
  return gulp.src(imgSrc)
    .pipe(newer(imgDest))
    .pipe(imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true,
        svgoPlugins: [{removeViewBox: true}],
        use: [pngquant(), gifsicle(), svgo(), jpegtran()]
    }))
    .pipe(gulp.dest(imgDest))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Concatenate and minify vendor scripts
gulp.task('scripts-vendor', function() {
  gulp.src(jsVendorSrc)
    .pipe(newer(jsVendorDest))
    .pipe(concat('vendor.min.js')) // concat pulls all our files together before minifying them
    .pipe(uglify())
    .pipe(rename('vendor.min.js'))
    .pipe(gulp.dest(jsVendorDest))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// copy all html files to output directory
gulp.task('html', function() {
  gulp.src('source/*.html')
    .pipe(newer(htmlDest))
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Run all tasks, then create a compressed file archive.zip
gulp.task('build',['html', 'images', 'scripts', 'scripts-vendor', 'css'], function(){
  return gulp.src('build/**/*')
    .pipe(zip(zipName))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['serve']);
