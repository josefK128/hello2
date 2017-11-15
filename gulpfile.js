// gulpfile.js - automated tasks - default ('gulp') is ts->js compile
// run: $>gulp <taskname>
//
// * NOTE: There is no explicit task 'task-list'. 
//         However 'gulp task-list' will produce a complete list 
//         of tasks and dependencies to stdout
//         pipe to 'gulpfile.tasks' for exp:
//         $ gulp task-list >gulpfile.tasks

// dependencies
var gulp = require('gulp');
var tslint = require("gulp-tslint");
var typescript = require('gulp-typescript');
var tsconfig = require('./tsconfig.json');
//var docco = require('gulp-docco');
//var del = require('del');
//var exec = require('child_process').exec;
//var sass = require('gulp-sass');
//var concat = require('gulp-concat');
//var annotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
//var uglify = require('gulp-uglify');
//require('gulp-task-list')(gulp);

 



// directory/file glob-patterns
// src - includes spec.ts unit-test files
var tsFiles = [
  './src/app/*.ts', 
  './src/app/**/*.ts'
];

// only for use by gulp docco 
// docco does not operate on ts-files ?! This seems to be a simple
// configuration fix which must be investigated.
// For now a mirror ```*.ts.js-file``` may be provided for each ```*.ts```
// so that docco will document the mirror file instead 
// The mirror is the identical file, but with a different file extension name: `// ``name.ts.js``` instead of ```name.ts```
var tsjsFiles = [
  './src/app/*.ts.js', 
  './src/app/**/*.ts.js'
];
var tsjsTestFiles = [
  './test/*.spec.ts.js', 
  './test/**/*.spec.ts.js' 
];
var devFiles = [
  './gulpfile.js', 
];

// defs
var webglDefsFiles = [
  './src/webgl/*.ts', 
  './src/webgl/**/*.ts' 
];

// styles
var styleFiles = [
  './src/styles/scss/*.scss'
];


// write destinations
var srcDest_es5 = './src/app-es5/',
    srcDest_es6 = './src/app-es6/',
    unitDest_es5 = './test/app-es5/',
    unitDest_es6 = './test/app-es6/',
    e2eDest_es5 = './e2e/app-es5/',
    e2eDest_es6 = './e2e/app-es6/',
    mockDest_es5 = './test/app-es5/mocks',
    mockDest_es6 = './test/app-es6/mocks',
    docDest = './docs/src',
    docTestDest = './docs/test',
    docDevDest = './docs/dev';
    defsDest = './src/app/views';
    buildDest = './dist';



// tasks
// task - ts2js: app/x.ts -> app-es6/x.js
// NOTE: includes spec.ts unit-test files
// NOTE: default task!
gulp.task('default', ['ts2js']);
gulp.task('ts2js', () => {
    var tsResult = gulp
        .src(tsFiles)
        .pipe(sourcemaps.init())
        .pipe(tslint())
        //.pipe(tslint.report("verbose"))
        .pipe(typescript(tsconfig.compilerOptions));

    if(tsconfig.compilerOptions.target === 'es5'){
        return tsResult.js.pipe(gulp.dest(srcDest_es5));
    }
    return tsResult.js
        //.pipe(sourcemaps.write('.')) // for separate sourcemap-files
        .pipe(sourcemaps.write())     // for sourcemap inline at end of js-file
        .pipe(gulp.dest(srcDest_es6));
});



// test - unit and e2e - starts server for e2e 
gulp.task('test', () => {
  exec('bash test-unit.sh');
  exec('bash test.sh');
});

// test - unit tests only - no server start 
gulp.task('test-unit', () => {
  exec('bash test-unit.sh');
});



// task - defs for webgl-textures and svg defs-files
// concatenates individual i3d/svg defs into src/views/
gulp.task('defs', ['webgl-defs']);

// task - webgl-defs:<br>
// concatenates individual shaders, etc. into views/webgl-defs.js
gulp.task('webgl-defs', () => {
  gulp.src(webglDefsFiles)
    .pipe(concat('webgl-defs.ts'))
    .pipe(gulp.dest(defsDest));
});



// task - sass:<br>
// translates .scss-files to .css-files
gulp.task('sass', () => {
  gulp.src(styleFiles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./src/styles/css'));
});



// task - docco:<br>
// generate side-by-side: L comments with R source (configurable)
// NOTE: docco does not process ts-files, so a temporary
// ts.js-file is provided for docco-only processing usage
// These files are in 'tsjsFiles' and 'tsjsTestFiles'
gulp.task('docco', () =>{
  gulp.src(tsFiles)
    .pipe(docco())
    .pipe(gulp.dest(docDest));
  gulp.src(tsjsFiles)
    .pipe(docco())
    .pipe(gulp.dest(docDest));
  gulp.src(devFiles)
    .pipe(docco())
    .pipe(gulp.dest(docDevDest));
});


// npm convenience tasks
// task - npm-install
// install all the packages listed in package.json
gulp.task('npm-install', () =>{
  exec('npm install', (err, stdout, stderr) => {
    if(err){console.log(err);}
  });
});

// task - npm-update:<br>
// check for more recent versions for node_modules.
// update all the packages listed to the latest version 
// specified by the tag config, and respecting semver.
gulp.task('npm-update', () =>{
  exec('npm update', (err, stdout, stderr) => {
    if(err){console.log(err);}
  });
});


// task - build:<br>
// archive of previous automated build
gulp.task('build', () => {
  var tsResult = gulp.src(tsFiles)
      .pipe(tslint())
      .pipe(tslint.report("verbose"))
      .pipe(typescript(tsconfig.compilerOptions))
      .pipe(annotate())
      .pipe(concat('build.js'))
      .pipe(gulp.dest(buildDest));
});

// NOTE: problem with uglify!
// task - build-min:<br>
// automated build and minification (uglify)
gulp.task('build-min', () => {
   return gulp.src(tsFiles)
      .pipe(tslint())
      .pipe(tslint.report("verbose"))
      .pipe(typescript(tsconfig.compilerOptions))
      .pipe(annotate())
      .pipe(uglify())
      .pipe(concat('build.min.js'))
      .pipe(gulp.dest(buildDest));
});


// task - generate:<br>
// update versions, automated build, build-min, and document
gulp.task('generate', ['sass', 'ts2js', 'build', 'docco']);


// clean
gulp.task('clean', (done) => {
    del(['./src/app-es6/*.js'], done);
    del(['./src/app-es6/**/*.js'], done);
    del(['./dist/*.js'], done);
});


