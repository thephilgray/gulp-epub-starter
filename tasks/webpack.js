import path from "path";
// import glob from "glob";
// import webpack from 'webpack';
// import VueLoaderPlugin from "vue-loader/lib/plugin";

import { contentDir, PRODUCTION } from "./config";

export let config = {
  entry: {
    main: [
      "@babel/polyfill",
      path.resolve(__dirname, "../src/script/index.js")
      // 'webpack/hot/dev-server',
      // 'webpack-hot-middleware/client'
    ]
  },
  // entry: entryArray,
  output: {
    path: path.resolve(__dirname, `${contentDir}/script/`),
    filename: "[name].js"
  },
  context: path.resolve(__dirname, `src`),
  mode: process.env.NODE_ENV,
  optimization: {
    minimize: PRODUCTION
    // splitChunks: {
    //   cacheGroups: {
    //     commons: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: "vendors",
    //       chunks: "all"
    //     }
    //   }
    // }
  },
  target: "web",

  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: "vue-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
        exclude: file => /css/.test(file) && !/\.css/.test(file)
      }
    ]
  },
  plugins: [
    // new VueLoaderPlugin()
    // new webpack.HotModuleReplacementPlugin()
  ]
};
