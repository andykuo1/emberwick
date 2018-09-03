const path = require('path');
const webpack = require('webpack');

module.exports = {
  //Change this to 'production' for optimizations
  mode: "development",
  //Entry point to start bundling...
  entry: {
    app: './src/index.js'
  },
  output: {
    //Output to ./dist/bundle.js
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: 'dist/'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: { presets: ['env'] }
      }
    ]
  },
  resolve: {
    //Resolve by filename without extensions
    extensions: ['*', '.js', '.mjs'],
    //Resolve by absolute path
    modules: [
      'node_modules',
      path.resolve('./src'),
      path.resolve('./res')
    ]
  },
  target: 'web',
  devServer: {
    contentBase: path.join(__dirname, '/'),//public/
    port: 8000,
    hotOnly: true,
    open: true,
    overlay: true
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'all'
        }
      }
    }
  },
  plugins: [ new webpack.HotModuleReplacementPlugin() ]
};
