import gulp from "gulp";
import del from "del";
import pug from "gulp-pug";
import rename from "gulp-rename";

import settings from "./settings";

const { buildPath, contentDirPath, contentDirname } = settings;

// full clean - not the fastest

// console.log(buildPath, contentDirPath);

const clean = () => del([contentDirPath]);

const generateMimetype = () =>
  gulp.src("./src/templates/mimetype").pipe(gulp.dest(buildPath));

const generateContainer = () =>
  gulp
    .src("./src/templates/container.pug")
    .pipe(
      pug({
        doctype: "xml",
        pretty: true,
        locals: { contentDirname }
      })
    )
    .pipe(
      rename(path => {
        path.extname = ".xml";
      })
    )
    .pipe(gulp.dest(buildPath + "/META-INF"));

export default gulp.series(clean, generateMimetype, generateContainer);
