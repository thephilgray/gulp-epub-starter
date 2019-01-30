import "regenerator-runtime/runtime";
import gulp from "gulp";
import server from "./server";
import packageEpub from "./package";
import init from "./init";
import { zipEpub } from "./zipEpub";
import {
  watchPug,
  watchCss,
  watchCssModules,
  watchJs,
  watchImages,
  assets
} from "./assets";
import { epubName } from "./config";

const exec = require("child_process").exec;

export const build = gulp.series(init, assets, packageEpub);

export const dev = gulp.series(
  build,
  server,
  gulp.parallel(watchPug, watchCss, watchCssModules, watchJs, watchImages)
);

export const validate = done => {
  exec(
    `java -jar bin/epubcheck-4.0.2/epubcheck.jar ./builds/${epubName} > ./builds/${epubName}.errors 2>&1`,
    function(err, stdout, stderr) {
      if (err) {
        console.log(stderr);
      }
      console.log(stdout);
    }
  );
  done();
};

export const publish = gulp.series(build, zipEpub, validate);

export default dev;
