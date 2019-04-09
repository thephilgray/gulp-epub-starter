import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import dateFormat from "date-fns/format";
import minimist from "minimist";
import uuidv5 from "uuid/v5";

const IDENTIFIER_NAMESPACE = "30948b9b-43c7-4771-a267-dea119c6238b";
/**
 *
 * TODO: Refactor as a class with getSettings and updateSettings methods, or following redux pattern;
 * Also handle the `assetlist` and `pagelist` in memory, perhaps merging some shared data with `pages`
 * Ideally, this should be a robust self-contained api that can be controlled directly from the command line or with build tools like Gulp
 *
 */

// TODO: Convert to async

let userSettings;

try {
  userSettings = yaml.safeLoad(fs.readFileSync("src/config.yaml", "utf8"));
} catch (e) {
  console.error(e);
}

// TODO: Include global stylesheet and script properties; these can be used to determine the path/name; if null, do not include on every page except where specified in `pages`

const settings = {
  name: "TEXTBOOK",
  distPath: path.join(process.cwd(), "dist"),
  PRODUCTION: process.env.NODE_ENV === "production",
  DEVELOPMENT: process.env.NODE_ENV === "development",
  DEVICE: process.env.DEVICE || "ipad",
  FIXED: minimist(process.argv.slice(2)).fixed || false,
  contentDirname: "OEBPS",
  title: "Textbook",
  subtitle: "Textbook",
  creator: [{ role: "author", text: "" }],
  date: dateFormat(new Date(), `YYYY-MM-DDThh:mm:ss`) + "Z",
  author: "Author",
  identifier: {
    scheme: "URN",
    text: "urn:uuidLOREMIPSUM"
  },
  language: "en",
  type: "Education",
  modified: dateFormat(new Date(), `YYYY-MM-DDThh:mm:ss`) + "Z",
  publisher: "Publisher",
  coverImage: {
    src: "images/cover.jpg",
    alt: "cover image"
  },
  pages: {}, // TODO: Include stylesheets and scripts properties
  pageProperties: {},
  devices: {
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
    { name: "otf", mediaType: "application/font-sfnt" },
    { name: "ttc", mediaType: "application/font-sfnt" },
    { name: "woff", mediaType: "application/font-woff" },
    { name: "woff2", mediaType: "font/woff2" },
    { name: "vtt", mediaType: "text/vtt" },
    { name: "xml", mediaType: "application/xml" },
    { name: "mp4", mediaType: "video/mp4" },
    { name: "mp3", mediaType: "audio/mp3" },
    { name: "m4a", mediaType: "audio/m4a" }
  ],

  ...userSettings
};

// allow user to set config.yaml with a path relative to the src root, but modify it relative to pages
// settings.coverImage.src = `../${settings.coverImage.src}`;

// settings.identifier.text = `${settings.identifier.text}-${dateFormat(
//   settings.date.replace("Z", ""),
//   "YYYYMMDD-hhmm"
// )}`;

settings.identifier.text = uuidv5(
  settings.identifier.text,
  IDENTIFIER_NAMESPACE
);

// create pageProperties map from pages in userSettings
settings.pageProperties = Object.keys(settings.pages).reduce((acc, curr) => {
  if (
    settings.pages[curr].properties &&
    settings.pages[curr].properties.length > 0
  ) {
    acc[curr] = settings.pages[curr].properties;
  }
  return acc;
}, {});

settings.epubName = `${settings.name}_${settings.DEVICE}${
  settings.PRODUCTION
    ? `_${dateFormat(settings.modified.replace("Z", ""), "YYYYMMDD-hhmm")}`
    : ""
}.epub`;

settings.buildPath = path.resolve(process.cwd(), "builds", settings.epubName);
settings.contentDirPath = path.resolve(
  settings.buildPath,
  settings.contentDirname
);

console.log(`Using ${settings.FIXED ? "fixed" : "reflowable"} layout.`);
console.log(settings);

export default settings;
