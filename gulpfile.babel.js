import gulp from 'gulp';
import del from 'del';
import mustache from 'gulp-mustache-plus';
import pug from 'gulp-pug';
import htmltidy from 'gulp-htmltidy';
import ext_replace from 'gulp-ext-replace';
import filelist from 'gulp-filelist';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import postcssEpub from 'postcss-epub';
import fileAssets from 'gulp-file-assets';
import image from 'gulp-image';

import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
// import gulpFont from 'gulp-font';
// import log from 'fancy-log';

import { kebabCase } from 'lodash';
import browserSync from 'browser-sync';

import files from './filelist.json';
import assetsList from './assetlist.json';

const settings = {
  name: 'cc-shared-culture',
  contentDir: 'EPUB',
  coverImage: {
    src: '../images/326261902_3fa36f548d.jpg',
    alt: 'cover-image, child against a wall'
  },
  meta: {
    title: 'Creative Commons - A Shared Culture',
    creator: 'Jesse Dylan',
    identifier: 'code.google.com.epub-samples.cc-shared-culture',
    language: 'en-US',
    modified: '2012-01-20T12:47:00Z',
    publisher: 'Creative Commons',
    contributor: 'mgylling',
    description:
      'Multiple video tests (see Navigation Document (toc) for details)',
    rights:
      'This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike (CC BY-NC-SA) license.',
    license: 'http://creativecommons.org/licenses/by-nc-sa/3.0/',
    attributionURL: 'http://creativecommons.org/videos/a-shared-culture'
  }
};

const readerContentDir = './reader/epub_content/';
const buildDir = readerContentDir + kebabCase(settings.name);
const contentDirname = settings.contentDir || 'OEPBS';
const contentDir = buildDir + '/' + contentDirname;

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
    .pipe(gulp.dest('.'));

const sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

export const toc = () =>
  gulp
    .src('./src/templates/toc.mustache')
    .pipe(mustache({ files }, { extension: '.xhtml' }))
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

const postcssPlugins = [postcssEpub({ strict: true })];

export const css = () =>
  gulp
    .src(['./src/**/*.scss'], { base: './src/' })
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(postcss(postcssPlugins))
    .pipe(gulp.dest(contentDir));

export const watchCss = () =>
  gulp.watch('./src/css/**/*.scss', gulp.series(css, reload));

export const images = () =>
  gulp
    .src(['./src/images/*'], { base: './src/' })
    .pipe(image())
    .pipe(gulp.dest(contentDir));

// import vueify from 'vueify';

export const js = () =>
  browserify(['./src/script/index.js'])
    // .transform(vueify)
    .transform(
      babelify.configure({
        presets: ['@babel/preset-env'],
        babel: require('@babel/core')
      })
    )
    .bundle()
    .pipe(source('shared.js'))
    .pipe(gulp.dest(`${contentDir}/script/`))
    .pipe(buffer());

export const watchJs = () =>
  gulp.watch('./src/script/**/*.js', gulp.series(js, reload));

// export const fonts = () =>
//   gulp
//     .src('./src/fonts/**/*.{ttf,otf}', { read: false })
//     .pipe(
//       gulpFont({
//         ext: '.css',
//         fontface: 'src/fonts',
//         relative: '/fonts',
//         dest: `${contentDir}/fonts`,
//         embed: ['woff'],
//         collate: false
//       })
//     )
//     .pipe(gulp.dest(`${contentDir}/fonts`));

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
    .pipe(gulp.dest('.'));

// map through the resulting assets list and use conditional logic to determine attrs
// compute with a second function or perform in assetList task with gulp-if

const mappedAssets = list => {};

export const generatePackageFile = () =>
  gulp
    .src('./src/templates/package.mustache')
    .pipe(
      mustache(
        { ...settings.meta, assets: assetsList, files },
        { extension: '.opf' }
      )
    )
    .pipe(gulp.dest(contentDir));

export const assets = done => {
  gulp.series(
    css,
    js,
    images,
    fonts,
    video,
    audio,
    captions,
    assetList,
    generatePackageFile,
    reload
  )();
  done();
};

const server = browserSync.create();
export const serve = done => {
  server.init({
    server: {
      baseDir: './reader/',
      index: 'index.html'
    },
    startPath: `index.html?epub=epub_content/${kebabCase(settings.name)}`
  });
  done();
};

export const reload = done => {
  server.reload();
  done();
};

export const init = done => {
  gulp.series(
    clean,
    generateMimetype,
    generateContainer,
    pages,
    pageList,
    toc,
    cover,
    assets
  )();
  done();
};

export const dev = done => {
  gulp.series(init, serve, gulp.parallel(watchPug, watchCss, watchJs))();
  done();
};
