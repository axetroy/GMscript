var webpack = require('webpack');
var path = require('path');
var scripts = require('./scripts/meta');

// webpack.config.js
module.exports = {
  entry: (function () {
    let obj = {};
    scripts.forEach(v=> obj[v.name] = path.join(__dirname, 'scripts', v.name));
    return obj;
  })(),
  output: {
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.coffee', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.(jsx|js)?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: []
        }
      },
      {
        test: /\.html$/,
        loader: "html"
      },
      {
        test: /.*\.svg$/,
        loaders: [
          'file-loader',
          'svgo-loader?useConfig=svgoConfig1'
        ]
      }
    ]
  },
  svgoConfig1: {
    plugins: [
      {removeTitle: true},
      {convertColors: {shorthex: false}},
      {convertPathData: false}
    ]
  },
  plugins: [
    //js文件的压缩
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   mangle: {
    //     except: ['$super', '$', 'exports', 'require']
    //   }
    // }),
  ]
};