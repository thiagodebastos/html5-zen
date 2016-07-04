'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import runSequence from 'run-sequence';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import zip from 'gulp-zip';
import gifsicle from 'imagemin-gifsicle';
import jpegtran from 'imagemin-jpegtran';
import pngquant from 'imagemin-pngquant';
import svgo from 'imagemin-svgo';
import pug from 'gulp-pug';

// POSTCSS
// import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import stylus from 'gulp-stylus';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import browserReporter from 'postcss-browser-reporter';
import reporter from 'postcss-reporter';

// file source and destination variables

// HTML: pug (formerly jade)
const pugSrc  = 'source/pug/views/**/*.pug';

// Images
const imgSrc       = 'source/img/**/*';
const imgDest      = 'build/img';

// Stylesheets
const cssSrc       = 'source/css/master.styl';
const cssDest      = 'build/css';

// Sripts
const jsSrc        = 'source/js/*.js';
const jsDest       = 'build/js';
const jsVendorSrc  = 'source/js/vendor/*.js';
const jsVendorDest = 'build/js/vendor';

// Data files
const dataSrc = 'source/data/**/*';
const dataDest = 'build/data';

// Boilerplate assets for site root
const siteRootSrc = 'source/_siteroot/*'
const siteRootDest = 'build'

// Handle errors
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// Static Server + watching css/html/js/image files
gulp.task('serve', ['build'], () => {

  browserSync.init(null, {
    files: ['build/css/*.styl', 'build/*.html', 'build/js/*.js', 'build/data/*.json'],
    server: {
       baseDir: './build',
    },
    notify: false,
    open: false,
  });

  gulp.watch("source/img/**/*", ['images'], browserSync.reload);
  gulp.watch("source/css/**/*.styl", ['styles']);
  gulp.watch("source/pug/**/*.pug", ['pug'], browserSync.reload);
  gulp.watch("source/data/*.json", ['data-copy'], browserSync.reload);
  gulp.watch("source/js/*.js", ['scripts'], browserSync.reload);
  gulp.watch("source/js/vendor/*.js", ['scripts-vendor'], browserSync.reload);
});

// Compile Stylus into CSS, add vendor prefixes & auto-inject into browser
gulp.task('styles', () => {
  const processors = [
    // cssnano(),
    autoprefixer({browsers: ['last 2 versions']}),
    browserReporter(),
    reporter(),
  ];
  // const settings = {
  //   parser: sugarss,
  // };
  gulp.src(cssSrc)
  .pipe(plumber())
  .pipe(stylus())
  .pipe(sourcemaps.init())
  .pipe(postcss(processors))
  .pipe(rename({ extname: '.css' }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(cssDest))
  .pipe(browserSync.stream({match: '**/*.css'}));
});

// Concatenate scripts (we don't minify these)

gulp.task('scripts', () => {
  gulp.src(jsSrc)
    .pipe(plumber())
    .pipe(newer(jsSrc))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(plumber.stop())
    .pipe(concat('main.js')) // concat pulls all our files together before minifying them
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(jsDest));
});

// Copy and optimise images from source to build
gulp.task('images', () => {
  gulp.src(imgSrc)
    .pipe(newer(imgDest))
    .pipe(imagemin({
      optimizationLevel: 7,
      progressive: true,
      interlaced: true,
      multipass: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant(), jpegtran(), gifsicle()],
    }))
    .pipe(gulp.dest(imgDest))
    .pipe(size({
      title: 'images',
    }));
});

// Copy changed vendor scripts to build dir
gulp.task('scripts-vendor', () => {
  gulp.src(jsVendorSrc)
    .pipe(newer(jsVendorDest))
    .pipe(gulp.dest(jsVendorDest));
});

// Copy changed data files to build dir
gulp.task('data-copy', () => {
  gulp.src(dataSrc)
    .pipe(newer(dataDest))
    .pipe(gulp.dest(dataDest));
});

// Copy site root assets to build dir
gulp.task('root-assets', () => {
  gulp.src(siteRootSrc)
    .pipe(newer(siteRootDest))
    .pipe(gulp.dest(siteRootDest));
});

gulp.task('pug', () => {
  gulp.src(pugSrc)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(pug({
      pretty: true,
    }))
    .pipe(gulp.dest('build'));
});

// gulp.task('clean', () => {
//     $.del(['build/'] );
// });

gulp.task('clean', del.bind(null, 'build/*', {
  dot: true,
}));

gulp.task('build', (callback) => {
  runSequence('clean', ['root-assets', 'data-copy', 'pug', 'images', 'scripts', 'scripts-vendor', 'styles'],
    callback);
});

gulp.task('default', ['serve']);
