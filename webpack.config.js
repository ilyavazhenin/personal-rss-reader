/* eslint-disable no-undef */
// Generated using webpack-cli https://github.com/webpack/webpack-cli

import { resolve, dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const directoryName = dirname(filename);

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: './src/index.js',
  output: {
    path: resolve(directoryName, 'dist'),
    filename: 'index.js',
  },
  // devtool: 'inline-source-map',
  target: 'web',
  watchOptions: {
    ignored: /node_modules/,
  },
  devServer: {
    open: true,
    host: 'localhost',
    // liveReload: true,
    watchFiles: ['*'],
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

export default () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
