const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const baseManifest = require('./chrome/manifest.json');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const config = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: path.join(__dirname, './dev/index.tsx'),
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
    publicPath: '/',
  },
  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '*'],
    fallback: {
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      url: require.resolve('url/'),
      querystring: require.resolve('querystring-es3'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'WebClip (dev)',
      meta: {
        charset: 'utf-8',
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        'theme-color': '#000000',
      },
      filename: 'index.html',
      template: './dev/index.html',
      hash: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
module.exports = config;
