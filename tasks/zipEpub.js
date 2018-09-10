import fs from "fs";
import mkdirp from "mkdirp";
import { buildDir, epubName } from "./config";
import epubZip from "epub-zip";

export const zipEpub = async () => {
  const content = await epubZip(`${buildDir}`);
  mkdirp("./builds", err => {
    if (err) console.error(err);
    else {
      return fs.writeFileSync(`./builds/${epubName}`, content);
    }
  });
};
