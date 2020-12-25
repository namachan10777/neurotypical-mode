import path from "path";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

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
      },
      {
        test: /\.(sa|c|sc)ss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
          { loader: "postcss-loader" },
        ]
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
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
};
