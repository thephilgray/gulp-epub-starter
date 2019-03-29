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
import through from "through2";
import { getTocDataFromArrayOfHtmlPathsOrStrings } from "toc-generator";

import packageEpub from "./package";
import { reload } from "./server";
import settings from "./config";

export const cleanPages = () =>
  del([`${settings.contentDirPath}/xhtml/*.xhtml`]);

// the local data to pass into the pug compiler

const pugOptions = {
  doctype: "xhtml",
  locals: {
    ...settings,
    viewport: settings.devices[settings.DEVICE].viewport,
    fixed: settings.FIXED,
    device: settings.DEVICE,
    tocPages: [],
    tocHeadings: []
  }
};

// stored as a named function for reuse; it will get called twice
const html = () => {
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
      .pipe(pug(pugOptions))
      .pipe(extReplace(".xhtml"))
  );
};

const compileTemplatesWithDataFromHTML = strings =>
  getTocDataFromArrayOfHtmlPathsOrStrings(strings) // parse the html to get the data
    .then(data => {
      // store the returned data locally
      // TODO: fix node-toc-generator to correctly handle this case; page property is broken when dealing with an array of html strings
      const dataWithUpdatedPages = data.map(heading => ({
        ...heading,
        page: pugOptions.locals.tocPages[heading.fileID]
      }));
      pugOptions.locals.tocHeadings = dataWithUpdatedPages;
      // compile the templates again with the updated data
      return html()
        .pipe(
          htmltidy({
            inputXml: true,
            outputXhtml: true,
            indent: "auto",
            wrap: 120,
            "wrap-attributes": false,
            "drop-empty-elements": "no"
          })
        )
        .pipe(extReplace(".xhtml"))
        .pipe(gulp.dest(settings.contentDirPath + "/xhtml"));
    })
    .catch(e => console.error(e));

// the main function, receives all compiled pug in a stream and pushes the contents to `strings`
// once the stream has ended and all the files have been pushed through, calls `compileTemplatesWithDataFromHTML` with the array of html strings

const getHTMLFromTemplates = () => {
  // just a local array to store strings of html pushed from the through2 stream
  const strings = [];

  return (
    through
      .obj((file, enc, cb) => {
        // push the strings of html to an array
        strings.push(file.contents.toString());
        // push the filenames to another array; TODO: update the lib to handle buffers not strings and return the filenames from the api
        console.log(path.basename(file.path));
        pugOptions.locals.tocPages.push(path.basename(file.path));
        // let through know that we're done with the current file
        cb(null);
      })
      // ensure it's finished and all files have been processed before attempting to get the data from the html and recompile the templates
      .on("end", () => compileTemplatesWithDataFromHTML(strings))
  );
};

export const pages = () => {
  return html().pipe(getHTMLFromTemplates());
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
