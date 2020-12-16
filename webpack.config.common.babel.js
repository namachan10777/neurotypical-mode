import path from "path";
import CopyPlugin from "copy-webpack-plugin";

export default {
  mode: process.env.NODE_ENV || "development",
  entry: {
    background: path.join(__dirname, "src/background.ts"),
    index: path.join(__dirname, "src/index.tsx"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "public",
          to: "."
        }
      ],
      options: {
      },
    }),
  ],
};
