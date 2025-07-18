const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV === "development";

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: isDev ? "development" : "production",
  devtool: isDev ? "source-map" : undefined,
  devServer: {
    static: {
      directory: "./dist",
    },
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: isDev,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
      {
        test: /\.(ico|png|svg|ttf|otf|eot|woff?2?)$/,
        exclude: /favicon\.png$/,
        type: "asset/resource",
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist"),
    assetModuleFilename: "asset/[name][ext]",
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "head",
      scriptLoading: "defer",
      favicon: "./src/images/favicon.png",
    }),
  ],
};
