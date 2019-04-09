import "regenerator-runtime/runtime";
import gulp from "gulp";
import server from "./server";
import packageEpub from "./package";
import init from "./init";
import { zipEpub } from "./zipEpub";
import {
  watchPug,
  watchPugUnlink,
  watchCss,
  watchCssModules,
  watchStatic,
  watchImages,
  assets
} from "./assets";
import settings from "./config";
const { epubName } = settings;

const exec = require("child_process").exec;

export const build = gulp.series(init, assets, packageEpub);

export const watchDeletedFiles = () => gulp.src("./src").on("unlink", build);

export const dev = gulp.series(
  build,
  server,
  gulp.parallel(
    watchPug,
    watchPugUnlink,
    watchCss,
    watchCssModules,
    watchImages,
    watchStatic,
    watchDeletedFiles
  )
);

export const validate = done => {
  exec(
    `java -jar config/epubcheck-4.1.1/epubcheck.jar ./dist/${epubName} > ./dist/${epubName}.errors 2>&1`,
    function(err, stdout, stderr) {
      if (err) {
        console.log(stderr);
      }
      console.log(stdout);
    }
  );
  done();
};

/* requires kindlegen installed locally */
export const kindlegen = done => {
  exec(`kindlegen ./dist/${epubName}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    }
    console.log(stdout);
  });
  done();
};

export const publish = gulp.series(build, zipEpub, validate);
export const publishKindle = gulp.series(publish, zipEpub, kindlegen);
export default dev;
