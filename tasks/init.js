import gulp from "gulp";
import del from "del";
import pug from "gulp-pug";
import rename from "gulp-rename";
import { readerContentDir, buildDir, contentDirname } from "./config";

// full clean - not the fastest

const clean = () => del([readerContentDir]);

gulp.task("clean", clean);

const generateMimetype = () =>
  gulp.src("./src/templates/mimetype").pipe(gulp.dest(buildDir));

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
    .pipe(gulp.dest(buildDir + "/META-INF"));

export default gulp.series("clean", generateMimetype, generateContainer);
