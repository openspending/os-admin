'use strict';

var webpack = require('webpack');

var plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

if (process.env.NODE_ENV == 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  );
}

module.exports = {
  entry: './app/scripts/index.js',
  devtool: 'source-map',
  output: {
    filename: 'os-admin.js',
    path: './public/scripts',
    library: 'osAdmin',
    libraryTarget: 'umd'
  },
  externals: {
  },
  module: {
    loaders: [
      {test: /\.html$/, loader: 'raw'},
      {test: /\.json/, loader: 'json'}
    ]
  },
  plugins: plugins
};
