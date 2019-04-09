import path from "path";
import fs from "fs-extra";
import gulp from "gulp";

import rename from "gulp-rename";
import pug from "gulp-pug";

import settings from "./settings";

// map through the resulting assets list and use conditional logic to determine attrs
// compute with a second function or perform in assetList task with gulp-if

const assetsMap = settings.exts.reduce((acc, curr) => {
  acc[curr.name] = curr.mediaType;
  return acc;
}, {});

const removePathBeforeFilename = filePath => filePath.split("/").pop();

const removeExtension = (filename, ignoreExtension) => {
  const extension = filename.split(".").pop();
  if (extension === ignoreExtension) {
    return filename.split(".").shift();
  } else {
    return filename;
  }
};

const mapAssets = list => {
  return list.map((item, i) => {
    const extension = item.split(".").pop();

    return {
      mediaType: assetsMap[extension],
      href: item,
      id: removeExtension(removePathBeforeFilename(item), "xhtml")
    };
  });
};

const toc = () =>
  gulp
    .src("./src/templates/toc.pug")
    .pipe(
      pug({
        doctype: "xhtml",
        pretty: true,
        locals: {
          ...settings,
          files: fs.readJSONSync(
            path.resolve(process.cwd(), "config/.tmp/pagelist.json")
          )
        }
      })
    )
    .pipe(
      rename(path => {
        path.extname = ".xhtml";
      })
    )
    .pipe(gulp.dest(`${settings.contentDirPath}/xhtml/`));

const tocNcx = () => {
  return gulp
    .src("./src/templates/tocncx.pug")
    .pipe(
      pug({
        doctype: "xml",
        pretty: true,
        locals: {
          ...settings,
          files: fs.readJSONSync(
            path.resolve(process.cwd(), "config/.tmp/pagelist.json")
          )
        }
      })
    )
    .pipe(
      rename(path => {
        path.basename = "toc";
        path.extname = ".ncx";
      })
    )
    .pipe(gulp.dest(`${settings.contentDirPath}/`));
};

// const cover = () =>
//   gulp
//     .src("./src/templates/cover.mustache")
//     .pipe(
//       mustache(
//         {
//           title: settings.title,
//           coverImage: settings.coverImage
//         },
//         { extension: ".xhtml" }
//       )
//     )
//     .pipe(gulp.dest(`${settings.contentDirPath}/xhtml/`));

const generatePackageFile = () =>
  gulp
    .src("./src/templates/content.pug")
    .pipe(
      pug({
        doctype: "xml",
        pretty: true,
        locals: {
          ...settings,
          assets: mapAssets(
            fs.readJSONSync(
              path.resolve(process.cwd(), "config/.tmp/assetList.json")
            )
          ),
          files: fs.readJSONSync(
            path.resolve(process.cwd(), "config/.tmp/pagelist.json")
          ),
          properties: settings.pageProperties,
          device: settings.DEVICE,
          fixed: settings.FIXED
        }
      })
    )
    .pipe(
      rename(path => {
        path.extname = ".opf";
      })
    )
    .pipe(gulp.dest(settings.contentDirPath));

export default gulp.series(
  // cover,
  toc,
  tocNcx,
  generatePackageFile
);
