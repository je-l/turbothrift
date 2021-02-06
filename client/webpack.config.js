const HtmlWebpackPlugin = require("html-webpack-plugin");
const createStyledComponentsTransformer = require("typescript-plugin-styled-components")
  .default;

const styledComponentsTransformer = createStyledComponentsTransformer();

module.exports = {
  entry: ["./src/index.tsx"],
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            getCustomTransformers: () => ({
              before: [styledComponentsTransformer],
            }),
          },
        },
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.(png|svg|jpg|gif)$/, use: "file-loader" },
      { test: /\.graphql$/, use: "raw-loader" },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "/index.html.template" })],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    host: "0.0.0.0",
    disableHostCheck: true, // For docker e2e tests
  },
};
