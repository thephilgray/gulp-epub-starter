import gulp from 'gulp';

import { server } from './server';
import {
  init,
  watchPug,
  watchCss,
  watchJs,
  assets,
  packageEpub
} from './tasks';

export const build = gulp.series('clean', init, assets, packageEpub);
export const dev = gulp.series(
  build,
  server,
  gulp.parallel(watchPug, watchCss, watchJs)
);

export default dev;
