import path from 'path';
import { kebabCase } from 'lodash';

export const settings = {
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

export const epubName = kebabCase(settings.name);
export const readerContentDir = path.resolve(
  __dirname,
  '../reader/epub_content/'
);
export const buildDir = readerContentDir + '/' + epubName;
export const contentDirname = settings.contentDir || 'OEPBS';
export const contentDir = buildDir + '/' + contentDirname;
