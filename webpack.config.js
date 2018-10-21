const path = require("path");
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "./"),
    filename: "app.js",
  },
  target: 'node', 
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["babel-preset-env"]
          }
        }
      }
    ]
  },
  mode: "production",
  stats: {
    colors: true
  },
  externals: [nodeExternals()],
};