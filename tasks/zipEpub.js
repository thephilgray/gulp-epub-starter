import fs from "fs";
import { buildDir, epubName } from "./config";
import epubZip from "epub-zip";

export const zipEpub = async () => {
  const content = await epubZip(`${buildDir}`);
  return fs.writeFileSync(`./${epubName}`, content);
};
