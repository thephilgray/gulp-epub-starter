import path from "path";
import gulp from "gulp";

import pug from "gulp-pug";
import htmltidy from "gulp-htmltidy";
import extReplace from "gulp-ext-replace";

import sass from "gulp-sass";
import sassVariables from "gulp-sass-variables";
import postcss from "gulp-postcss";

import image from "gulp-image";
import data from "gulp-data";
import autoprefixer from "autoprefixer";
// import sourcemaps from "gulp-sourcemaps";
import gulpif from "gulp-if";
import cssbeautify from "gulp-cssbeautify";

import packageEpub from "./package";
import { scripts } from "./scripts";
import { reload } from "./server";

import {
  contentDir,
  PRODUCTION,
  DEVELOPMENT,
  settings,
  RENDITION
} from "./config";

export const pages = () => {
  let currentPageNumber = 0;
  return gulp
    .src(["./src/pages/**/*.pug"], { base: "./src/pages/" })
    .pipe(
      data(file => ({
        filename: path.basename(file.path).replace(".pug", ""),
        pageNumber: ++currentPageNumber
      }))
    )
    .pipe(
      pug({
        doctype: "xhtml",
        locals: {
          epubTitle: settings.meta.title,
          subtitle: settings.meta.subtitle,
          modified: settings.meta.modified,
          viewport:
            RENDITION === "reflowable"
              ? false
              : settings.renditions[RENDITION].viewport,
          rendition: RENDITION
        }
      })
    )
    .pipe(
      gulpif(
        DEVELOPMENT,
        htmltidy({
          doctype: "xhtml",
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
      )
    )
    .pipe(extReplace(".xhtml"))
    .pipe(gulp.dest(contentDir + "/xhtml"));
};

export const watchPug = () =>
  gulp.watch("./src/**/*.pug", gulp.series(pages, packageEpub, reload));

// sass to css with sourcemap and epub postcss

const sassOptions = {
  errLogToConsole: true,
  outputStyle: PRODUCTION ? "compressed" : "expanded"
  // includePaths: ["node_modules/susy/sass"]
};

const postcssPlugins = [
  // use .browserlistrc for browsers option
  autoprefixer()
];

export const css = () =>
  gulp
    .src(["./src/css/styles.scss"], { base: "./src/" })
    .pipe(
      // pipe $rendition variable into scss for conditional styling
      sassVariables({
        $rendition: RENDITION
      })
    )
    .pipe(sass(sassOptions).on("error", sass.logError))
    .pipe(postcss(postcssPlugins))
    .pipe(cssbeautify())
    .pipe(gulp.dest(contentDir));

export const watchCss = () =>
  gulp.watch("./src/css/**/*.scss", gulp.series(css, reload));

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

export const fonts = () =>
  gulp
    .src("./src/fonts/**/*.{ttf,otf,ttc}")
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
  css,
  images,
  fonts,
  video,
  audio,
  captions,
  scripts
);
