import settings from "./config";
import LaunchEpub from "launch-epub";

const { buildPath } = settings;
const readium = new LaunchEpub(buildPath);

export const reload = done => {
  readium.reload();
  done();
};

export default done => {
  readium.start();
  done();
};
