const path = require("path");
const webpack = require("webpack");

module.exports = {
  //Entry point to start bundling...
  entry: './src/index.js',
  //Change this to 'production' for optimizations
  mode: "development",
  module: {
    rules: [
      {
        //Load js
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: { presets: ['env'] }
      }
    ]
  },
  resolve: {
    //Resolve by filename without extensions
    extensions: ['.js'],
    //Resolve by absolute path
    modules: [
      path.resolve('./src'),
      'node_modules'
    ]
  },
  output: {
    //Output to ./dist/bundle.js
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    //For devServer to find directory from project root
    publicPath: '/dist/'
  },
  target: 'web',
  devServer: {
    contentBase: path.join(__dirname, '/'),//public/
    port: 8000,
    //For devServer to find directory from web user
    publicPath: 'http://localhost:8000/dist/',
    hotOnly: true,
    open: true
  },
  plugins: [ new webpack.HotModuleReplacementPlugin() ]
};
