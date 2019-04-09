import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";
import settings from "./config";
import epubZip from "epub-zip";

const { buildPath, epubName, distPath } = settings;
export const zipEpub = async () => {
  const content = await epubZip(`${buildPath}`);
  mkdirp(distPath, err => {
    if (err) console.error(err);
    else {
      return fs.writeFileSync(path.join(distPath, epubName), content);
    }
  });
};
