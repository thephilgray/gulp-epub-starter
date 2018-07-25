import gulp from 'gulp';
import zip from 'gulp-zip';
import { buildDir, epubName } from './config';

export const zipEpub = () =>
  gulp
    .src(`${buildDir}/**/*`)
    .pipe(zip(`${epubName}.epub`))
    .pipe(gulp.dest('.'));
