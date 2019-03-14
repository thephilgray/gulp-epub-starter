import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";
import { buildDir, epubName, distDir } from "./config";
import epubZip from "epub-zip";

export const zipEpub = async () => {
  const content = await epubZip(`${buildDir}`);
  mkdirp(distDir, err => {
    if (err) console.error(err);
    else {
      return fs.writeFileSync(path.join(distDir, epubName), content);
    }
  });
};
