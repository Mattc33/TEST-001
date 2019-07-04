'use strict';

const
    gulp = require('gulp'),
    bust = require('gulp-buster'),
    replace = require('gulp-token-replace'),
    gprint = require('gulp-print'),
    gFlatten = require('gulp-flatten'),
    spSave = require('gulp-spsave'),
    spSync = require('gulp-spsync'),
    run = require('gulp-run'),
    runSequence = require('run-sequence'),
    //wmgUtil = require('./deploy/utility'),
    build = require('@microsoft/sp-build-web'),
    gPrint = require('gulp-print'),
    gUtil = require('gulp-util'),
    gSass = require('gulp-sass'),
    CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin'),
    async = require('async'),
    webpack = require('webpack'),
    spRequest = require('sp-request'),
    inquirer = require('inquirer'),
    args = require('yargs').argv,
    path = require('path'),
    bundleAnalyzer = require('webpack-bundle-analyzer');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
build.addSuppression(/^Warning - \[sass\].*$/);
build.addSuppression(/^DEPRECATION WARNING on.*$/);

// Build CSS - TODO
// CSS
const cacheBustCssSubtask = build.subTask('cache-bust-css-task', gCacheBustCss);
const cacheBustCss = build.task('cache-bust-css', cacheBustCssSubtask);

const compileCssSubtask = build.subTask('build-sass-task', gCompileCss);
const compileCssTask = build.task('build-sass', compileCssSubtask);

const moveCssSubtask = build.subTask('move-css-task', gMoveCss);
const moveCssTask = build.task('move-css', moveCssSubtask);

const moveFontSubtask = build.subTask('move-font-task', gMoveFont);
const moveFontTask = build.task('move-font', moveFontSubtask);

const moveImagesSubtask = build.subTask('move-images-task', gMoveImages);
const moveImagesTask = build.task('move-images', moveImagesSubtask);

const moveScriptsSubtask = build.subTask('move-static-scripts-task', gMoveScripts);
const moveScriptsTask = build.task('move-static-scripts', moveScriptsSubtask);

const cssSubTask = build.subTask('build-css-task', gBuildCssMaster);
const css = build.task('build-css', cssSubTask);

// END: CSS

// Build MasterPage - TODO

// Build PageLayouts -TODO

/********************************************************************************************
 * Adds an alias for handlebars in order to avoid errors while gulping the project
 * https://github.com/wycats/handlebars.js/issues/1174
 * Adds a loader and a node setting for webpacking the handlebars-helpers correctly
 * https://github.com/helpers/handlebars-helpers/issues/263
 ********************************************************************************************/
build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {

    generatedConfiguration.resolve.alias = { handlebars: 'handlebars/dist/handlebars.min.js' };

    generatedConfiguration.module.rules.push(
      { 
        test: /utils\.js$/, 
        loader: 'unlazy-loader', 
        include: [
            /node_modules/,
        ]  
      }
    );

    generatedConfiguration.node = { fs: 'empty' }

    const lastDirName = path.basename(__dirname);
    const dropPath = path.join(__dirname, 'temp', 'stats');
    generatedConfiguration.plugins.push(new bundleAnalyzer.BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: path.join(dropPath, `${lastDirName}.stats.html`),
      generateStatsFile: true,
      statsFilename: path.join(dropPath, `${lastDirName}.stats.json`),
      logLevel: 'error'
    }));
    
    // generatedConfiguration.plugins.push(
    //   new CaseSensitivePathsPlugin()
    // );

    generatedConfiguration.devtool = 'source-map';

    for (var i = 0; i < generatedConfiguration.plugins.length; i++) {
      const plugin = generatedConfiguration.plugins[i];
      if (plugin instanceof webpack.optimize.UglifyJsPlugin) {
        plugin.options.sourceMap = true;
        break;
      }
    }

    return generatedConfiguration;
  }
});

build.rig.addPostBuildTask(
  [ 
    compileCssTask, 
    moveFontTask, 
    moveCssTask, 
    moveScriptsTask
  ]
);


build.initialize(gulp);


/********
 * BUILD
 ********/
// CSS BUILD TASKS - TODO
function gBuildCssMaster(gulp, buildOptions, done) {
  runSequence(
      'build-sass',
      'move-font',
      'move-static-scripts',
      'move-css',
      'move-images', 
      'cache-bust-css',  
      function() {
        console.log("!!CSS complete!!");
        done();
      }
    );
}

function gCacheBustCss(gulp, buildOptions, done) {
  return gulp.src('dist/css/**/*.css')
      .pipe(bust({fileName: 'styles.busters.json'}))
      .pipe(gulp.dest('hash'));
}

function gCompileCss(gulp, buildOptions, done) {
  return gulp.src('stylesheet/sass/**/*.scss')
      .pipe(gSass().on('error', gSass.logError))
      .pipe(gulp.dest('dist/css'));
}

function gMoveFont(gulp, buildOptions, done) {
  return gulp.src('stylesheet/font/**/*')
      .pipe(gulp.dest('./dist/_wmg-portal/font'))
      .pipe(gulp.dest('./dist/font'));
}

function gMoveCss(gulp, buildOptions, done) {
  return gulp.src('stylesheet/css/**/*.css')
      .pipe(gulp.dest('./dist/css'));
}

function gMoveImages(gulp, buildOptions, done) {
  return gulp.src('stylesheet/images/**/*.*')
      .pipe(gulp.dest('./dist/_wmg-portal/images'))
      .pipe(gulp.dest('./dist/images'));
}

function gMoveScripts(gulp, buildOptions, done) {
  return gulp.src('stylesheet/scripts/**/*.js')
      .pipe(gulp.dest('./dist/scripts'));
}

// MASTER BUILD TASKS - TODO


/*********
 * DEPLOY
 *********/
//ALL DEPLOY TASKS. - TODO