import path from "path";
import kebabCase from "lodash/kebabCase";
import dateFormat from "date-fns/format";
import minimist from "minimist";

export const settings = {
  name: "TEXTBOOK",
  contentDir: "OEBPS",
  renditions: {
    android: {
      viewport: {
        height: 1280,
        width: 800
      }
    },
    kindle: {
      viewport: {
        height: 1280,
        width: 800
      }
    },
    ipad: {
      viewport: {
        height: 800,
        width: 600
      }
    }
  },
  coverImage: {
    src: "../images/cover.jpg",
    alt: ""
  },
  meta: {
    title: "Textbook",
    creator: ["Lorem Creator", "Ipsum Creator"],
    date: "2018-08-22T01:47:08-04:00",
    author: "Lorem Author",
    identifier: "urn:uuidLOREMIPSUM",
    language: "en-US",
    modified: dateFormat(new Date(), `YYYY-MM-DDThh:mm`) + ":00Z",
    publisher: "Lorem Ipsum Publisher"
  },
  exts: [
    { name: "js", mediaType: "application/javascript" },
    { name: "css", mediaType: "text/css" },
    { name: "xhtml", mediaType: "application/xhtml+xml" },
    { name: "jpg", mediaType: "image/jpeg" },
    { name: "jpeg", mediaType: "image/jpeg" },
    { name: "png", mediaType: "image/png" },
    { name: "gif", mediaType: "image/gif" },
    { name: "svg", mediaType: "image/svg+xml" },
    { name: "ttf", mediaType: "application/font-sfnt" },
    { name: "ttc", mediaType: "application/font-sfnt" },
    { name: "woff", mediaType: "application/font-woff" },
    { name: "woff2", mediaType: "font/woff2" },
    { name: "vtt", mediaType: "text/vtt" },
    { name: "xml", mediaType: "application/xml" },
    { name: "mp4", mediaType: "video/mp4" },
    { name: "mp3", mediaType: "audio/mp3" }
  ],
  pageProperties: {
    page01: ["scripted"]
  },
  tocPages: {
    page01: {
      title: "First Page"
    }
  }
};
export const PRODUCTION = process.env.NODE_ENV === "production";
export const DEVELOPMENT = process.env.NODE_ENV === "development";
export const RENDITION = process.env.RENDITION || "ipad";
export const FIXED =
  minimist(process.argv.slice(2)).fixed || settings.fixed || false;

console.log(`Using ${FIXED ? "fixed" : "reflowable"} layout`);

export const epubName =
  kebabCase(settings.name) +
  "." +
  RENDITION +
  "." +
  settings.meta.modified +
  ".epub";
export const readerContentDir = path.resolve(
  __dirname,
  "../reader/epub_content/"
);
export const buildDir = readerContentDir + "/" + epubName;
export const contentDirname = settings.contentDir || "OEBPS";
export const contentDir = buildDir + "/" + contentDirname;
