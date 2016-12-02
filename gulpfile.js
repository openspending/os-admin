'use strict';

var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');

var frontSrcDir = path.join(__dirname, '/app');
var frontAssetsDir = path.join(frontSrcDir, '/assets');
var frontStylesDir = path.join(frontSrcDir, '/styles');

var publicDir = path.join(__dirname, '/public');
var publicStylesDir = path.join(publicDir, '/styles');
var publicFontsDir = path.join(publicDir, '/fonts');
var publicAssetsDir = path.join(publicDir, '/assets');

var nodeModulesDir = path.join(__dirname, '/node_modules');

gulp.task('default', [
  'styles',
  'assets'
]);

gulp.task('styles', function() {
  var files = [
    path.join(nodeModulesDir, '/font-awesome/css/font-awesome.css'),
    path.join(nodeModulesDir, '/os-mockups/assets/css/openspending.css'),
    path.join(frontStylesDir, '/main.css'),
    path.join(nodeModulesDir, '/angular/angular-csp.css')
  ];
  return gulp.src(files)
    .pipe(concat('os-admin.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(publicStylesDir));
});

gulp.task('assets', [
  'assets.images',
  'assets.favicon',
  'assets.fonts'
]);

gulp.task('assets.images', function() {
  return gulp.src([
    path.join(frontAssetsDir, '/**/*'),
    path.join(nodeModulesDir, '/os-mockups/assets/os-assets/**/*'),
    path.join(nodeModulesDir, '/os-mockups/assets/img/**/*')
  ])
    .pipe(gulp.dest(publicAssetsDir));
});

gulp.task('assets.favicon', function() {
  return gulp.src([
    path.join(nodeModulesDir, '/os-mockups/assets/favicon.ico')
  ])
    .pipe(gulp.dest(publicDir));
});

gulp.task('assets.fonts', function() {
  var files = [
    path.join(nodeModulesDir, '/font-awesome/fonts/*'),
    path.join(nodeModulesDir, '/os-mockups/assets/fonts/**/*')
  ];
  return gulp.src(files)
    .pipe(gulp.dest(publicFontsDir));
});
