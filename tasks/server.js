import path from "path";
import { buildDir } from "./config";
import LaunchEpub from "launch-epub";

const readium = new LaunchEpub(buildDir);

export const reload = done => {
  readium.reload();
  done();
};

export default done => {
  readium.start();
  done();
};
