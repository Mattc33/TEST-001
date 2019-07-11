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
    viewportUtil = require('./config/viewport/utility'),
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

const moveBootstrapFontSubtask = build.subTask('move-bootstrap-font-task', gMoveBootstrapFont);
const moveBootstrapFontTask = build.task('move-bootstrap-font', moveBootstrapFontSubtask);

const moveImagesSubtask = build.subTask('move-images-task', gMoveImages);
const moveImagesTask = build.task('move-images', moveImagesSubtask);

const moveScriptsSubtask = build.subTask('move-static-scripts-task', gMoveScripts);
const moveScriptsTask = build.task('move-static-scripts', moveScriptsSubtask);

const cssSubTask = build.subTask('build-css-task', gBuildCssMaster);
const css = build.task('build-css', cssSubTask);

// END: CSS

// Deploy CSS/fonts/image etc....

const deployPortalCssTask = build.subTask('deploy-portal-css-task', gDeployPortalCss);
const deployPortalCss = build.task('deploy-portal-css', deployPortalCssTask);

const deployPortalFontTask = build.subTask('deploy-portal-font-task', gDeployPortalFont);
const deployPortalFont = build.task('deploy-portal-font', deployPortalFontTask);

const deployPortalBootstrapTask = build.subTask('deploy-portal-bootstrap-task', gDeployPortalBootstrap);
const deployPortalBootstrap = build.task('deploy-portal-bootstrap', deployPortalBootstrapTask);

const deployImagesSubTask = build.subTask('deploy-portal-images-task', gDeployPortalImages);
const deployImages = build.task('deploy-portal-images', deployImagesSubTask);

const deployCssSubTask = build.subTask('deploy-css-task', gDeployCssMaster);
const deployCss = build.task('deploy-css', deployCssSubTask);

// END:

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
    moveBootstrapFontTask,
    moveImagesTask,
    moveCssTask, 
    moveScriptsTask,
    cacheBustCss
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
      'move-bootstrap-font',
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

function gMoveBootstrapFont(gulp, buildOptions, done) {
  return gulp.src('stylesheet/sass/bootstrap-sass-3.3.6/assets/fonts/bootstrap/**/*')
      .pipe(gulp.dest('./dist/_wmg-portal/fonts'))
      .pipe(gulp.dest('./dist/fonts/bootstrap'));
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
//ALL DEPLOY TASKS. -
function gDeployCssMaster(gulp, buildOptions, done) {

  console.log(args.env);

  const settings = viewportUtil.getEnv(args.env || null);

  if(settings == null) {
      throw new gUtil.PluginError('deploy-css', {
          message: 'Invalid argument: "env"'
      });
  }

  runSequence(
      'deploy-portal-css',
      'deploy-portal-font',
      'deploy-portal-images',
      'deploy-portal-bootstrap',
      function() {
          console.log("!!CSS deployed!!");
          done();
      }
  )

}

function gDeployPortalCss(gulp, buildOptions, done) {

  const settings = viewportUtil.getEnv(args.env || null);

  if(settings === null) {
      throw new gUtil.PluginError('deploy-css', {
          message: 'Invalid argument: "env"'
      });
  }

  return gulp.src(settings.portal.glob.cssGlob)
      .pipe(spSave(settings.portal.cssCore, settings.portal.creds));
}

function gDeployPortalImages(gulp, buildOptions, done) {

  const settings = viewportUtil.getEnv(args.env || null);

  if(settings === null) {
      throw new gUtil.PluginError('deploy-images', {
          message: 'Invalid argument: "env"'
      });
  }

  return gulp.src(settings.portal.glob.imageGlob)
      .pipe(spSave(settings.portal.imageCore, settings.portal.creds));
}

function gDeployPortalFont(gulp, buildOptions, done) {
  const settings = viewportUtil.getEnv(args.env || null);

  if( settings === null) {
      throw new gUtil.PluginError('deploy-portal-font', {
          message: 'Invalid argument: "env"'
      });
  }

  return gulp.src(settings.portal.glob.fontGlob)
      .pipe(spSave(settings.portal.fontCore, settings.portal.creds));
}

function gDeployPortalBootstrap(gulp, buildOptions, done) {
  const settings = viewportUtil.getEnv(args.env || null);

  if(settings === null) {
      throw new gUtil.PluginError('deploy-portal-bootstrap', {
          message: 'Invalid argument: "env"'
      });
  }

  return gulp.src(settings.portal.glob.bootstrapGlob)
      .pipe(spSave(settings.portal.bootstrapCore, settings.portal.creds));
}

