import path from "path";
import del from "del";
import gulp from "gulp";
import pug from "gulp-pug";
import htmltidy from "gulp-htmltidy";
import extReplace from "gulp-ext-replace";
import filelist from "gulp-filelist";
import fileAssets from "gulp-file-assets";
import less from "gulp-less";
import lessVariables from "gulp-add-less-variables";
import postcss from "gulp-postcss";
import image from "gulp-image";
import data from "gulp-data";
import autoprefixer from "autoprefixer";
import gulpif from "gulp-if";
import cssbeautify from "gulp-cssbeautify";
import concat from "gulp-concat";
import filter from "gulp-filter";
import purgecss from "gulp-purgecss";

import packageEpub from "./package";
import { reload } from "./server";
import settings from "./config";

export const cleanPages = () =>
  del([`${settings.contentDirPath}/xhtml/*.xhtml`]);

export const pages = () => {
  const f = filter(["**", "!**/**/cover.pug"]);
  let currentPageNumber = 0;
  return (
    gulp
      .src(["./src/pages/**/*.pug"], {
        base: "./src/pages/"
      })
      /* filter out cover.pug for kindle */
      .pipe(gulpif(settings.DEVICE === "kindle", f))
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
            ...settings,
            viewport: settings.devices[settings.DEVICE].viewport,
            fixed: settings.FIXED,
            device: settings.DEVICE
          }
        })
      )
      .pipe(
        gulpif(
          settings.DEVELOPMENT,
          htmltidy({
            doctype: "xhtml",
            outputXhtml: "yes",
            indent: "auto",
            wrap: 120,
            "wrap-attributes": false,
            "drop-empty-elements": "no"
          })
        )
      )
      .pipe(
        gulpif(
          settings.PRODUCTION,
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
      .pipe(gulp.dest(settings.contentDirPath + "/xhtml"))
  );
};

export const watchPug = () =>
  gulp.watch(
    "./src/**/*.pug",
    { events: ["change", "add", "addDir"] },
    gulp.series(pages, assetList, pageList, packageEpub, reload)
  );
export const watchPugUnlink = () =>
  gulp.watch(
    "./src/**/*.pug",
    { events: ["unlink", "unlinkDir"] },
    gulp.series(cleanPages, pages, assetList, pageList, packageEpub, reload)
  );

const lessOptions = {};

const postcssPlugins = [
  // use .browserlistrc for browsers option
  autoprefixer()
];

export const css = () => {
  return gulp
    .src("./src/css/styles.less", {
      base: "./src/"
    })
    .pipe(
      // pipe $rendition variable into scss for conditional styling
      lessVariables({
        device: settings.DEVICE,
        fixed: settings.FIXED
      })
    )
    .pipe(less(lessOptions).on("error", console.error.bind(console)))
    .pipe(postcss(postcssPlugins))
    .pipe(
      gulpif(
        settings.PRODUCTION,
        purgecss({
          content: [settings.contentDirPath + "/xhtml/*.xhtml"]
        })
      )
    )
    .pipe(cssbeautify())
    .pipe(gulp.dest(settings.contentDirPath));
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

export const images = () =>
  gulp
    .src(["./src/**/*.{jpg,jpeg,png,gif,svg}"], { base: "./src/" })
    .pipe(
      image({
        pngquant: false,
        optipng: false,
        zopflipng: false,
        jpegRecompress: settings.PRODUCTION,
        mozjpeg: false,
        guetzli: false,
        gifsicle: false,
        svgo: false,
        concurrent: 10,
        quiet: true // defaults to false
      })
    )
    .pipe(gulp.dest(settings.contentDirPath));

export const watchImages = () =>
  gulp.watch("./src/images/*", gulp.series(images, reload));

// for now, just handle js as static assets
// TODO: reintroduce bundling in a later version

const staticExtensions = settings.exts
  .filter(ext => !["xhtml,css,jpg,jpeg,png,gif,svg"].includes(ext.name))
  .map(ext => ext.name)
  .join(",");

console.log(staticExtensions);

export const staticAssets = () =>
  gulp
    .src(`./src/**/*.{${staticExtensions}}`)
    .pipe(gulp.dest(settings.contentDirPath));

export const watchStatic = () =>
  gulp.watch(
    [`./src/**/*.{${staticExtensions}}`],
    gulp.series(staticAssets, reload)
  );

// TODO: Run analysis before compile so that unused assets can be filtered out of the streams

const assetList = () =>
  gulp
    .src([`${settings.contentDirPath}/xhtml/*.xhtml`], {
      base: `${settings.contentDirPath}`
    })
    .pipe(
      fileAssets({
        // manually add mp3, wav, mp4, webm to default extensions
        exts: settings.exts.map(ext => ext.name)
      })
    )
    .pipe(filelist("assetlist.json", { relative: true }))
    .pipe(gulp.dest("./.tmp/"));

const pageList = () =>
  gulp
    .src([`${settings.contentDirPath}/xhtml/*.xhtml`])
    .pipe(filelist("pagelist.json", { flatten: true, removeExtensions: true }))
    .pipe(gulp.dest("./.tmp/"));

export const assets = gulp.series(
  pages,
  cssModules,
  css,
  images,
  staticAssets,
  assetList,
  pageList
);
