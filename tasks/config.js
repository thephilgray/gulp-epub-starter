import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import dateFormat from "date-fns/format";
import minimist from "minimist";

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

const presets = {
  name: "",
  contentDir: "",
  fixed: false,
  title: {},
  creator: [{ role: "author", text: "" }],
  date: dateFormat(new Date(), `YYYY-MM-DDThh:mm:ss`) + "Z",
  author: "",
  identifier: {
    scheme: "URN",
    text: ""
  },
  language: "en",
  type: "",
  modified: dateFormat(new Date(), `YYYY-MM-DDThh:mm:ss`) + "Z",
  publisher: "",
  coverImage: {
    src: "images/cover.jpg",
    alt: ""
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
  ]
};

const extendedSettings = { ...presets, ...userSettings };

// allow user to set config.yaml with a path relative to the src root, but modify it relative to pages
// extendedSettings.coverImage.src = `../${extendedSettings.coverImage.src}`;

// TODO: finalize URN naming convention
extendedSettings.identifier.text = `${
  extendedSettings.identifier.text
}-${dateFormat(extendedSettings.date.replace("Z", ""), "YYYYMMDD-hhmm")}`;

// create pageProperties map from pages in userSettings

extendedSettings.pageProperties = Object.keys(extendedSettings.pages).reduce(
  (acc, curr) => {
    if (
      extendedSettings.pages[curr].properties &&
      extendedSettings.pages[curr].properties.length > 0
    ) {
      acc[curr] = extendedSettings.pages[curr].properties;
    }
    return acc;
  },
  {}
);

console.log(extendedSettings);

export const settings = extendedSettings;

export const PRODUCTION = process.env.NODE_ENV === "production";
export const DEVELOPMENT = process.env.NODE_ENV === "development";

// TODO: Set these on the settings object
export const DEVICE = process.env.DEVICE || "ipad";
export const FIXED =
  minimist(process.argv.slice(2)).fixed || settings.fixed || false;

console.log(`Using ${FIXED ? "fixed" : "reflowable"} layout.`);

console.log(settings.modified);

export const epubName = `${settings.name}_${DEVICE}${
  PRODUCTION
    ? "_" + dateFormat(settings.modified.replace("Z", ""), "YYYYMMDD-hhmm")
    : ""
}.epub`;

export const readerContentDir = path.resolve(process.cwd(), "builds");
export const buildDir = path.join(readerContentDir, epubName);
export const contentDirname = settings.contentDir || "OEBPS";
export const contentDir = path.join(buildDir, contentDirname);
export const distDir = path.join(process.cwd(), "dist");
