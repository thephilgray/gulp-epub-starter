import path from 'path';
// import gulp from 'gulp';
import Browser from 'browser-sync';
import webpack from 'webpack';
// import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';

import { config as webpackConfig } from './webpack';
import { epubName } from './config';

const browser = Browser.create();
const bundler = webpack(webpackConfig);

export function server(done) {
  let config = {
    server: {
      baseDir: path.resolve(__dirname, '../reader/'),
      index: 'index.html'
    },
    startPath: `index.html?epub=epub_content/${epubName}`
    // middleware: [
    //   webpackDevMiddleware(bundler, {
    //     /* options */
    //   }),
    //   webpackHotMiddleware(bundler)
    // ]
  };

  browser.init(config);
  done();
}


// for initial markup development

export function serverSimple(done) {
  let config = {
    server: {
      baseDir: path.resolve(__dirname, `../reader/epub_content/${epubName}/EPUB/`),
      directory: true
    }
  };

  browser.init(config);
  done();
}

export const reload = done => {
  browser.reload();
  done();
};
