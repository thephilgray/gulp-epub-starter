import path from 'path';
import { kebabCase } from 'lodash';

export const settings = {
  name: 'TEXTBOOK',
  contentDir: 'EPUB',
  coverImage: {
    src: '../images/cover.jpg',
    alt: ''
  },
  meta: {
    title: 'Textbook: Unit 1: The Global Economy',
    creator: 'NFATC',
    identifier: 'RU-U1-TX',
    language: 'en-US',
    modified: '2015-01-20T12:47:00Z',
    publisher: 'Creative Commons',
    contributor: 'DEPARTMENT OF STATE',
  }
};


export const exts = [
  { name: 'js', mediaType: 'application/javascript' },
  { name: 'css', mediaType: 'text/css' },
  { name: 'xhtml', mediaType: 'application/xhtml+xml' },
  { name: 'jpg', mediaType: 'image/jpeg' },
  { name: 'jpeg', mediaType: 'image/jpeg' },
  { name: 'png', mediaType: 'image/png' },
  { name: 'gif', mediaType: 'image/gif' },
  { name: 'svg', mediaType: 'image/svg+xml' },
  { name: 'ttf', mediaType: 'application/x-font-ttf' },
  { name: 'ttc', mediaType: 'application/x-font-ttc' },
  { name: 'woff', mediaType: 'application/font-woff' },
  { name: 'woff2', mediaType: 'font/woff2' },
  { name: 'vtt', mediaType: 'text/vtt' },
  { name: 'xml', mediaType: 'application/xml' },
]

export const epubName = kebabCase(settings.name) + '.epub';
export const readerContentDir = path.resolve(
  __dirname,
  '../reader/epub_content/'
);
export const buildDir = readerContentDir + '/' + epubName;
export const contentDirname = settings.contentDir || 'OEPBS';
export const contentDir = buildDir + '/' + contentDirname;
