import settings from "./settings";
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
