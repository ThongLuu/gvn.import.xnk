require("babel-polyfill");
const path = require("path");
const common = require("./webpack.common");
const listProxy = require("../server/listProxy");
const redirectAuth = require("../server/auth/redirectAuth");

module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: path.resolve('./build'),
    filename: "[name]-[hash].js",
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: "/"
  },
  ...common,
  devServer: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
    historyApiFallback: true,
    disableHostCheck: true,
    proxy: listProxy,
    before: function(app, server, compiler) {
      redirectAuth(app);
    },
    contentBase: path.resolve('public'),
  },
  devtool: "source-map",
};