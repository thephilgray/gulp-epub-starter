import gulp from 'gulp';
import del from 'del';
import mustache from 'gulp-mustache-plus';
import pug from 'gulp-pug';
import htmltidy from 'gulp-htmltidy';
import ext_replace from 'gulp-ext-replace';
import filelist from 'gulp-filelist';
import sass from 'gulp-sass';
// import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import postcssEpub from 'postcss-epub';
import fileAssets from 'gulp-file-assets';
import image from 'gulp-image';

import { scripts } from './scripts';
import { reload } from './server';

import {
  settings,
  readerContentDir,
  buildDir,
  contentDirname,
  contentDir
} from './config';

// full clean
const clean = () => del([readerContentDir]);

gulp.task('clean', clean);

export const generateMimetype = () =>
  gulp.src('./src/templates/mimetype').pipe(gulp.dest(buildDir));

export const generateContainer = () =>
  gulp
    .src('./src/templates/container.mustache')
    .pipe(
      mustache(
        { contentDirname },
        {
          extension: '.xml'
        }
      )
    )
    .pipe(gulp.dest(buildDir + '/META-INF'));

export const pages = () =>
  gulp
    .src(['./src/pages/**/*.pug'], { base: './src/pages/' })
    .pipe(pug({ doctype: 'xhtml' }))
    .pipe(htmltidy({ doctype: 'xhtml', 'output-xhtml': 'yes' }))
    .pipe(ext_replace('.xhtml'))
    .pipe(gulp.dest(contentDir + '/xhtml'));

export const watchPug = () =>
  gulp.watch('./src/pages/**/*.pug', gulp.series(pages, reload));

export const pageList = () =>
  gulp
    .src([`${contentDir}/xhtml/*.xhtml`])
    .pipe(filelist('filelist.json', { flatten: true, removeExtensions: true }))
    .pipe(gulp.dest('../'));

export const toc = () =>
  gulp
    .src('./src/templates/toc.mustache')
    .pipe(
      mustache(
        { files: require('./../filelist.json') },
        { extension: '.xhtml' }
      )
    )
    .pipe(gulp.dest(`${contentDir}/xhtml/`));

export const cover = () =>
  gulp
    .src('./src/templates/cover.mustache')
    .pipe(
      mustache(
        { title: settings.meta.title, coverImage: settings.coverImage },
        { extension: '.xhtml' }
      )
    )
    .pipe(gulp.dest(`${contentDir}/xhtml/`));

// sass to css with sourcemap and epub postcss

const sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

const postcssPlugins = [postcssEpub({ strict: true })];

export const css = () =>
  gulp
    .src(['./src/**/*.scss'], { base: './src/' })
    // .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    // .pipe(sourcemaps.write())
    .pipe(postcss(postcssPlugins))
    .pipe(gulp.dest(contentDir));

export const watchCss = () =>
  gulp.watch('./src/css/**/*.scss', gulp.series(css, reload));

export const watchJs = () =>
  gulp.watch(
    ['./src/script/**/*.js', './src/script/**/*.vue'],
    gulp.series(scripts, reload)
  );

export const images = () =>
  gulp
    .src(['./src/images/*'], { base: './src/' })
    .pipe(image())
    .pipe(gulp.dest(contentDir));

export const fonts = () =>
  gulp
    .src('./src/fonts/**/*.{ttf,otf}')
    .pipe(gulp.dest(`${contentDir}/fonts/`));

export const video = () =>
  gulp
    .src('./src/video/**/*.{mp4,webm}')
    .pipe(gulp.dest(`${contentDir}/video/`));

export const audio = () =>
  gulp
    .src('./src/audio/**/*.{mp3,wav}')
    .pipe(gulp.dest(`${contentDir}/audio/`));

export const captions = () =>
  gulp
    .src('./src/captions/**/*.{vtt,xml}')
    .pipe(gulp.dest(`${contentDir}/captions/`));

export const assetList = () =>
  gulp
    .src([`${contentDir}/xhtml/*.xhtml`], { base: `${contentDir}` })
    .pipe(
      fileAssets({
        // manually add mp3, wav, mp4, webm to default extensions
        exts: [
          'js',
          'css',
          'html',
          'tpl',
          'jpg',
          'jpeg',
          'png',
          'gif',
          'svg',
          'webp',
          'ttf',
          'eot',
          'otf',
          'woff',
          'mp3',
          'wav',
          'mp4',
          'webm',
          'vtt',
          'xml'
        ]
      })
    )
    .pipe(filelist('assetlist.json', { relative: true }))
    .pipe(gulp.dest('../'));

// map through the resulting assets list and use conditional logic to determine attrs
// compute with a second function or perform in assetList task with gulp-if

const mappedAssets = list => {};

export const generatePackageFile = () =>
  gulp
    .src('./src/templates/package.mustache')
    .pipe(
      mustache(
        {
          ...settings.meta,
          assets: require('../assetlist.json'),
          files: require('../filelist.json')
        },
        { extension: '.opf' }
      )
    )
    .pipe(gulp.dest(contentDir));

export const assets = gulp.series(
  css,
  images,
  fonts,
  video,
  audio,
  captions,
  scripts,
  assetList,
  generatePackageFile
);

export const init = gulp.series(
  generateMimetype,
  generateContainer,
  pages,
  pageList,
  toc,
  cover
);
