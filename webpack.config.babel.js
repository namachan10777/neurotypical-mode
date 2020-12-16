import path from "path";
import CopyPlugin from "copy-webpack-plugin";
import WebpackExtensionManifestPlugin from 'webpack-extension-manifest-plugin';
import baseManifest from "./manifest.js";
import pkg from "./package.json";

export default {
  mode: process.env.NODE_ENV || "development",
  entry: {
    background: path.join(__dirname, "src/background.ts"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "public",
          to: "dist"
        }
      ],
      options: {
      },
    }),
    new WebpackExtensionManifestPlugin({
      config: {
        base: baseManifest,
        extend: {
          version: pkg.version,
          name: pkg.name,
          description: pkg.description,
        },
      }
    }),
  ],
};
