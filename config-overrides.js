const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const git = require("git-rev-sync");
const rewireReactHotLoader = require("react-app-rewire-hot-loader");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");

const isProduction = process.env.NODE_ENV === "production";

const {
  override,
  useEslintRc,
  addWebpackExternals,
  addBundleVisualizer,
  addTslintLoader,
  enableEslintTypescript,
  addWebpackAlias,
  addDecoratorsLegacy,
  fixBabelImports,
  addLessLoader,
} = require("customize-cra");
// const entries = require('./config-entry');
// const multipleEntry = require('react-app-rewire-multiple-entry')(entries);

module.exports = {
  webpack: override(
    addDecoratorsLegacy(),
    // addTslintLoader(),
    // enableEslintTypescript(),
    fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: true,
    }),
    // useEslintRc(),
    addWebpackAlias({
      "~": path.resolve(__dirname, "src/"),
      src: path.resolve(__dirname, "src/"),
      root: path.resolve(__dirname, "src/"),
    }),
    // addBundleVisualizer(),
    // multipleEntry.addMultiEntry,
    // rewireReactHotLoader,
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: {
          // Primary
          "@primary-color": "#2acd8f",
          "@link-color": "#2acd8f",
          "@border-radius-base": "2px",

          // Input
          "@input-placeholder-color": "#a3afb7",
          "@input-hover-border-color": "#2acd8f",

          // Button
          "@button-primary-bg": "#2acd8f",
          // Button lg
          "@btn-height-lg": "48px",
          "@btn-padding-lg": "11px",
          "btn-font-size-lg": "20px",

          // Table
          "@table-header-bg": "#ffffff",

          // Font
          "@font-size-base": "14px",
        },
      },
    }),
    (config) => {
      const tsJSONPath = path.resolve(__dirname, "tsconfig.json");
      const tsJson = JSON.parse(fs.readFileSync(tsJSONPath, "UTF8"));

      tsJson.compilerOptions.paths = {
        "~/*": ["src/*"],
      };
      tsJson.compilerOptions.baseUrl = ".";

      fs.writeFileSync(tsJSONPath, JSON.stringify(tsJson, null, 2));

      let _env = process.env.AppEnv || "local";

      if (!isProduction) {
        config.plugins.push(
          new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            exclude: /node_modules/,
            // add errors to webpack instead of warnings
            failOnError: true,
            // set the current working directory for displaying module paths
            cwd: process.cwd(),
          })
        );
      }

      config.plugins.push(
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
          REACT_APP_GIT_COMMIT: JSON.stringify(git.long()),
          // You can pass any key-value pairs, this was just an example.
          // WHATEVER: 42 will replace %WHATEVER% with 42 in index.html.
        }),
        new webpack.DefinePlugin({
          "process.env.ENV_NAME": JSON.stringify(_env),
          "process.env.LANGUAGE": JSON.stringify(process.env.LANGUAGE),
        })
      );
      return config;
    }
  ),
};
