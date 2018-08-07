import webpack from "webpack";
import { config } from "./webpack";

export function scripts() {
  return new Promise(resolve =>
    webpack(config, (err, stats) => {
      if (err) console.log("Webpack", err);

      console.log(
        stats.toString({
          /* stats options */
        })
      );

      resolve();
    })
  );
}
