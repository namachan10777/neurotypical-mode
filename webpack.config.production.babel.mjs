import path from "path";
import WebpackExtensionManifestPlugin from "webpack-extension-manifest-plugin";
import baseManifest from "./manifest.mjs";
import commonConfig from "./webpack.config.common.babel.mjs";
import pkg from "./package.json" assert { type: "json" };
import { merge } from "webpack-merge";

export default merge(commonConfig, {
  mode: "production",
  plugins: [
    new WebpackExtensionManifestPlugin({
      config: {
        base: baseManifest,
        extend: {
          version: pkg.version,
          name: pkg.name,
          description: pkg.description,
        },
      },
    }),
  ],
});
