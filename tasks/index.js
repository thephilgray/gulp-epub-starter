import gulp from 'gulp';

var exec = require('child_process').exec;

import { epubName } from './config';

import { server } from './server';
import {
  init,
  watchPug,
  watchCss,
  watchJs,
  assets,
  packageEpub
} from './tasks';
import { zipEpub } from './zipEpub';

export const build = gulp.series('clean', init, assets, packageEpub);

export const dev = gulp.series(
  build,
  server,
  gulp.parallel(watchPug, watchCss, watchJs)
);
export const validate = done => {
  exec(
    `java -jar bin/epubcheck-4.0.2/epubcheck.jar ${epubName}.epub > ${epubName}.epub.errors 2>&1`,
    function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    }
  );
  done();
};

export const publish = gulp.series(zipEpub, validate);

export default dev;
