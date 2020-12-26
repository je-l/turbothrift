const HtmlWebpackPlugin = require("html-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");

module.exports = {
  entry: ["./src/index.tsx"],
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.(png|svg|jpg|gif)$/, use: "file-loader" },
      { test: /\.graphql$/, use: "raw-loader" },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "/index.html.template" }),
    new EnvironmentPlugin(["GOOGLE_CLIENT_ID"]),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    host: "0.0.0.0",
  },
};
