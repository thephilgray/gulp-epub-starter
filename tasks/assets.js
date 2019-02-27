import path from "path";
import gulp from "gulp";
import pug from "gulp-pug";
import htmltidy from "gulp-htmltidy";
import extReplace from "gulp-ext-replace";

import less from "gulp-less";
import lessVariables from "gulp-add-less-variables";

// import sass from "gulp-sass";
// import sassVariables from "gulp-sass-variables";

import postcss from "gulp-postcss";
import image from "gulp-image";
import data from "gulp-data";
import autoprefixer from "autoprefixer";
// import sourcemaps from "gulp-sourcemaps";
import gulpif from "gulp-if";
import cssbeautify from "gulp-cssbeautify";
import concat from "gulp-concat";

import packageEpub from "./package";
import { scripts } from "./scripts";
import { reload } from "./server";

import {
  contentDir,
  PRODUCTION,
  DEVELOPMENT,
  settings,
  DEVICE,
  FIXED
} from "./config";
const filter = require("gulp-filter");
const purgecss = require("gulp-purgecss");

export const pages = () => {
  const f = filter(["**", "!**/**/cover.pug"]);
  let currentPageNumber = 0;
  return (
    gulp
      .src(["./src/pages/**/*.pug"], { base: "./src/pages/" })
      /* filter out cover.pug for kindle */
      .pipe(gulpif(DEVICE === "kindle", f))
      .pipe(
        data(file => ({
          filename: path.basename(file.path).replace(".pug", ""),
          pageNumber: ++currentPageNumber
        }))
      )
      .pipe(
        pug({
          doctype: "xhtml",
<<<<<<< Updated upstream
          "output-xhtml": "yes",
          indent: "auto",
          wrap: 120,
          "wrap-attributes": false,
          "drop-empty-elements": "no"
        })
      )
    )
    .pipe(
      gulpif(
        PRODUCTION,
        htmltidy({
          doctype: "xhtml",
          "output-xhtml": "yes",
          indent: "auto",
          wrap: 120,
          "wrap-attributes": false,
          "drop-empty-elements": "no"
        })
=======
          locals: {
            ...settings,
            viewport: settings.devices[DEVICE].viewport,
            fixed: FIXED,
            device: DEVICE
          }
        })
      )
      .pipe(
        gulpif(
          DEVELOPMENT,
          htmltidy({
            doctype: "xhtml",
            outputXhtml: "yes",
            indent: "auto",
            wrap: 120,
            "wrap-attributes": false,
            "drop-empty-elements": "no"
          })
        )
>>>>>>> Stashed changes
      )
      .pipe(
        gulpif(
          PRODUCTION,
          htmltidy({
            inputXml: true,
            outputXhtml: true,
            indent: "auto",
            wrap: 120,
            "wrap-attributes": false,
            "drop-empty-elements": "no"
          })
        )
      )
      .pipe(extReplace(".xhtml"))
      .pipe(gulp.dest(contentDir + "/xhtml"))
  );
};

export const watchPug = () =>
  gulp.watch("./src/**/*.pug", gulp.series(pages, packageEpub, reload));

// sass to css with sourcemap and epub postcss

const lessOptions = {};

const postcssPlugins = [
  // use .browserlistrc for browsers option
  autoprefixer()
];

export const css = () => {
  // let errorHandler = notify.onError(function(error) {
  //   console.log("LESS error: " + error.message);
  //   return "LESS error: " + error.message;
  // });

  return gulp
    .src("./src/css/styles.less", {
      base: "./src/"
    })
    .pipe(
      // pipe $rendition variable into scss for conditional styling
      lessVariables({
        device: DEVICE,
        fixed: FIXED
      })
    )
    .pipe(less(lessOptions).on("error", console.error.bind(console)))
    .pipe(postcss(postcssPlugins))
    .pipe(
      gulpif(
        PRODUCTION,
        purgecss({
          content: [contentDir + "/xhtml/*.xhtml"]
        })
      )
    )
    .pipe(cssbeautify())
    .pipe(gulp.dest(contentDir));
};

export const watchCss = () =>
  gulp.watch(["./src/**/*.less"], gulp.series(css, reload));

// careful: writes back to src directory; gathers all module css and concats it into a single files in srcs/css

export const cssModules = () => {
  return gulp
    .src("./src/components/**/*.less", {
      base: "./src/"
    })
    .pipe(concat("components.less"))
    .pipe(gulp.dest("./src/css/generated"));
};

export const watchCssModules = () =>
  gulp.watch(["./src/components/**/*.less"], gulp.series(cssModules, css));

export const watchJs = () =>
  gulp.watch(
    ["./src/script/**/*.js", "./src/script/**/*.vue"],
    gulp.series(scripts, reload)
  );

export const images = () =>
  gulp
    .src(["./src/images/*"], { base: "./src/" })
    .pipe(
      image({
        pngquant: false,
        optipng: false,
        zopflipng: false,
        jpegRecompress: PRODUCTION,
        mozjpeg: false,
        guetzli: false,
        gifsicle: false,
        svgo: false,
        concurrent: 10,
        quiet: true // defaults to false
      })
    )
    .pipe(gulp.dest(contentDir));

export const watchImages = () =>
  gulp.watch("./src/images/*", gulp.series(images, reload));

export const fonts = () =>
  gulp
    .src("./src/fonts/**/*.{ttf,otf,ttc,woff,woff2,eot,svg}")
    .pipe(gulp.dest(`${contentDir}/fonts/`));

export const video = () =>
  gulp
    .src("./src/video/**/*.{mp4,webm}")
    .pipe(gulp.dest(`${contentDir}/video/`));

export const audio = () =>
  gulp
    .src("./src/audio/**/*.{mp3,wav}")
    .pipe(gulp.dest(`${contentDir}/audio/`));

export const captions = () =>
  gulp
    .src("./src/captions/**/*.{vtt,xml}")
    .pipe(gulp.dest(`${contentDir}/captions/`));

export const assets = gulp.series(
  pages,
  cssModules,
  css,
  images,
  fonts,
  video,
  audio,
  captions,
  scripts
);
