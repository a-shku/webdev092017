// _________________________________________________________

const gulp = require('gulp');

//for pages
const pug = require("gulp-pug");

//for styles
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require("gulp-autoprefixer");
const mincss = require("gulp-csso");

//for images
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');

//for svg
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

//for change
const gulpIf = require('gulp-if');
const del = require('del');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const wait = require('gulp-wait');

//for errors
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

//for view
const browserSync = require('browser-sync').create();


// _________________________________________________________

// source
const paths = {
    root: './dist',
    templates: {
        src: 'src/templates/**/*.pug',
        dest: 'dist/assets/'
    },
    fonts: {
        src: 'src/fonts/**/*.*',
        dest: 'dist/assets/fonts'
    },
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'dist/assets/styles/'
    },
    images: {
        src: 'src/images/**/*.{png,svg,jpg}',
        dest: 'dist/assets/images/'
    },
    svg: {
        src: 'src/sprite/**/*.svg',
        dest: 'src/images/'
    },
    scripts: {
      src: 'src/scripts/**/*.*',
      dest: 'dist/assets/scripts/'
  }

};

// _______________for project assembly_____________________

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

// _________________________________________________________

// pug
function templates() {
     return gulp.src("./src/templates/pages/**/*.pug")
    .pipe(pug({ pretty: "\t" }))
    .pipe(gulp.dest(paths.root))
    .pipe(browserSync.stream({ once: true }));   
}

exports.templates = templates;

// // fonts
function fonts() {
    return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))   
}

// // styles
function styles() {
    return gulp.src("./src/styles/*main.scss")
    .pipe(plumber({errorHandler: notify.onError(function (err) {return {title: 'Style', message: err.message}})}))
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass({
        includePaths: require('node-normalize-scss').includePaths
    }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename({suffix: '.min'}))
    // .pipe(mincss())
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest(paths.styles.dest));  
}

// images
function images() {
    return gulp.src(paths.images.src)
    // .pipe(cache(imagemin(
    //     {
    //         optimizationLevel: 3, 
    //         progressive: true,
    //         interlaced: true
    //     })))
          .pipe(gulp.dest(paths.images.dest));
}

// scripts
function scripts() {
  return gulp.src(paths.scripts.src)
        .pipe(gulp.dest(paths.scripts.dest));
}

// svg-спрайт
function toSvg() {
    return gulp
      .src(paths.svg.src)
      .pipe(
        svgmin({
          js2svg: {
            pretty: true
          }
        })
      )
      .pipe(
        cheerio({
          run: function($) {
            $("[fill]").removeAttr("fill");
            $("[stroke]").removeAttr("stroke");
            $("[style]").removeAttr("style");
          },
          parserOptions: {
            xmlMode: false
          }
        })
      )
      .pipe(replace("&gt;", ">"))
      .pipe(
        svgSprite({
          mode: {
            symbol: {
              sprite: "../sprite.svg",
              example: {
                dest: "../tmp/spriteSvgDemo.html" // демо html
              }
            }
          }
        })
      )
      .pipe(gulp.dest(paths.svg.dest));
  }

exports.toSvg = toSvg;

// watch
function watch() {
  gulp.watch(paths.templates.src, templates);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.scripts.src, scripts);
}


// // server
function server() {
   browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  browserSync.watch(['./dist/**/*.*'], { ignored: ["**/*.html"] }, browserSync.reload);   
}


// gulp.task('default', gulp.series (server, watch));


function clean() {
    return del(paths.root);
}

// //project assembly (production)
gulp.task('default', gulp.series(
    clean,
    gulp.parallel(templates, styles, images, fonts, scripts),
    gulp.parallel(watch, server)
));