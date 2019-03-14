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
  // watchJs,
  watchImages,
  assets
} from "./assets";
import { epubName } from "./config";

const exec = require("child_process").exec;

export const build = gulp.series(init, assets, packageEpub);

export const watchDeletedFiles = () => gulp.src("./src").on("unlink", build);

export const dev = gulp.series(
  build,
  server,
  // gulp.parallel(watchPug, watchCss, watchCssModules, watchJs, watchImages)
  gulp.parallel(
    watchPug,
    watchPugUnlink,
    watchCss,
    watchCssModules,
    watchImages,
    watchDeletedFiles
  )
);

export const validate = done => {
  exec(
    `java -jar bin/epubcheck-4.0.2/epubcheck.jar ./builds/${epubName} > ./builds/${epubName}.errors 2>&1`,
    function(err, stdout, stderr) {
      if (err) {
        console.log(stderr);
      }
      console.log(stdout);
      // open in books automatically
      // exec(`open ./builds/${epubName}`, (err, stdout, stderr) => {
      //   if (err) {
      //     console.error(err);
      //   }
      //   console.log(stdout);
      // });
    }
  );
  done();
};

/* requires kindlegen installed locally */
export const kindlegen = done => {
  exec(`kindlegen ./builds/${epubName}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    }
    console.log(stdout);
    // // open it in kindle
    // exec(kin
    //   `open -a Kindle ./builds/${epubName.replace(
    //     ".epub",
    //     ".mobi"
    //   )}  > ./builds/${epubName}.errors 2>&1`,
    //   (err, stdout, stderr) => {
    //     if (err) {
    //       console.error(err);
    //     }
    //     console.log(stdout);
    //   }
    // );
  });
  done();
};

export const publish = gulp.series(build, zipEpub, validate);

export const publishKindle = gulp.series(publish, zipEpub, kindlegen);

export default dev;
