const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const git = require("git-rev-sync");
const rewireReactHotLoader = require("react-app-rewire-hot-loader");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");

const isProduction = process.env.NODE_ENV === "production";

const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    entry: 'src/entry/dds.js',
    template: 'public/dds.html',
    outPath: '/dds.html'
  },
  {
    entry: 'src/entry/landing.js',
    template: 'public/landing.html',
    outPath: '/landing.html'
  },
  {
    entry: 'src/entry/old.js',
    template: 'public/index.html',
    outPath: '/old.html'
  },
  {
    entry: 'src/entry/airdrop.js',
    template: 'public/airdrop.html',
    outPath: '/airdrop.html'
  }
]);

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
    addTslintLoader(),
    // enableEslintTypescript(),
    multipleEntry.addMultiEntry,
    fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: true,
    }),
    fixBabelImports("import-mobile", {
      libraryName: "antd-mobile",
      style: "css",
    }),
    // useEslintRc(),
    addWebpackAlias({
      "~": path.resolve(__dirname, "src/"),
      src: path.resolve(__dirname, "src/"),
      locale: path.resolve(__dirname, "src/locale"),
      root: path.resolve(__dirname, "src/"),
    }),
    // addBundleVisualizer(),
    // multipleEntry.addMultiEntry,
    // rewireReactHotLoader,
    addLessLoader({
      modifyVars: {
        // Primary
        "primary-color": "#1346FF",
        "btn-border-radius-base": "2px",

        "radio-button-active-color": "#F55858",
        "radio-button-hover-color": "#F55858",
        "radio-solid-checked-color": "#F55858",
        // "@link-color": "#2acd8f",
        // "@border-radius-base": "2px",

        // // Input
        // "@input-placeholder-color": "#a3afb7",
        // "@input-hover-border-color": "#2acd8f",

        // // Button
        // "@button-primary-bg": "#2acd8f",
        // // Button lg
        // "@btn-height-lg": "48px",
        // "@btn-padding-lg": "11px",
        // "btn-font-size-lg": "20px",

        // // Table
        // "@table-header-bg": "#ffffff",

        // // Font
        // "@font-size-base": "14px",
        // Menu
        "input-height-base": "50px",
        "input-disabled-color": "#333",
        "input-disabled-bg": "#e7ebf4",

        "btn-height-base": "50px",
        'btn-danger-bg': '#F55858',

        "alert-warning-bg-color": "rgba(220, 74, 69, 0.06)",
        "alert-warning-border-color": "rgba(220, 74, 69, 0.51)",
        "alert-text-color": "#DC4A45",
        "alert-message-color": "#DC4A45",

        "modal-mask-bg": "rgba(0,0,0,0.5)",
        "modal-header-border-width": 0,
        "modal-header-title-font-size": "24px",
        "modal-heading-color": "#333",
        "modal-close-color": "#333",
        "modal-header-padding": "36px 0",

        "checkbox-color": "#F55858",
        "checkbox-check-bg": "#F55858",

        "menu-bg": "#1346ff",
        "menu-item-color": "#FFF",
        "menu-item-active-border-width": 0,
        "menu-item-active-bg": "#1346ff",
        "menu-highlight-color": "#FFF",
      },
      lessOptions: {
        javascriptEnabled: true,
      },
    }),
    (config) => {
      const tsJSONPath = path.resolve(__dirname, "tsconfig.json");
      const tsJson = JSON.parse(fs.readFileSync(tsJSONPath, "UTF8"));

      tsJson.compilerOptions.paths = {
        "~/*": ["src/*"],
        "locale/*": ["src/locale/*"],
      };
      tsJson.compilerOptions.baseUrl = "src";

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
