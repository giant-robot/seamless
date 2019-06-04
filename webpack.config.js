const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';


module.exports = {
  entry: __dirname + '/src/seamless.js',
  mode: process.env.NODE_ENV,
  devtool: 'source-map',
  target: 'node',
  output: {
    path: __dirname + '/dist',
    filename: `seamless${isProd ? '.min' : ''}.js`,
    library: 'Seamless',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
    ]
  },
  externals: {
    jquery: 'jQuery',
    waypoints: 'waypoints'
  },
  resolve: {
    alias: {
      waypoints: "waypoints/src/waypoint",
      jquery: "jquery/src/jquery"
    },
    extensions: ['.js']
  },
  optimization: {
    minimize: isProd,
    minimizer: [
      new UglifyJsPlugin({
        test: /\.min\.js$/,
        sourceMap: !isProd,
        uglifyOptions: {
          compress: isProd,
          ecma: 6,
          mangle: true
        }
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
  ]
};
