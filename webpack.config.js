const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const baseManifest = require('./chrome/manifest.json');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const config = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    content: path.join(__dirname, './src/content.tsx'),
    background: path.join(__dirname, './src/background.ts'),
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '*'],
    fallback: {
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'boilerplate', // change this to your app title
      meta: {
        charset: 'utf-8',
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        'theme-color': '#000000',
      },
      chunks: ['app'],
      manifest: 'manifest.json',
      filename: 'index.html',
      template: './src/assets/index.html',
      hash: true,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'chrome/icons',
          to: 'icons',
        },
      ],
    }),
    new WebpackExtensionManifestPlugin({
      config: {
        base: baseManifest,
      },
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
