const path = require('path');

module.exports = {
  mode: "production",
  entry: {
    "performance": "./src/performance.js",
    "performanceCookie": "./src/performance.cookie.js",
    "performanceFinger": "./src/performance.fingerprint.js",
    "performanceAll": "./src/performance.all.js"
  },
  output: {
    library: 'fireTrack',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, "dist"),
    publicPath: './dist/',
    filename: '[name].min.js'
  },

  module: {
    rules: []
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
