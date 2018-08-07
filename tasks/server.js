import path from "path";
import Browser from "browser-sync";
import { epubName } from "./config";

const browser = Browser.create();

export const reload = done => {
  browser.reload();
  done();
};

export default done => {
  let config = {
    server: {
      baseDir: path.resolve(__dirname, "../reader/"),
      index: "index.html"
    },
    startPath: `index.html?epub=epub_content/${epubName}`
  };

  browser.init(config);
  done();
};
