const path = require('path');

module.exports = {
  mode: "production",
  entry: {"performance": "./src/performance.js","performanceFinger": "./src/performance.fingerprint.js"},
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].min.js",
    library: "fireTrack",
    libraryTarget: "umd",
  },

  module: {
    rules: [
    ]
  },

  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ],
    extensions: [".js", ".json"],
  },

  plugins: [

  ]
}
