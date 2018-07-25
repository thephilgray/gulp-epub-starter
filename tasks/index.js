import gulp from 'gulp';

import { server } from './server';
import { init, watchPug, watchCss, watchJs, assets } from './tasks';

export const build = gulp.series('clean', init, assets);
export const dev = gulp.series(
  init,
  assets,
  server,
  gulp.parallel(watchPug, watchCss, watchJs)
);

export default dev;
