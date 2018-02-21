'use strict';

var _ = require('lodash');
var fs = require('fs');
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
  entry: {
    'os-admin': './app/scripts/index.js',
    'snippets': _.map(fs.readdirSync('./app/snippets/'), function(filename) {
      return './app/snippets/' + filename;
    })
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: './public/scripts',
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
