/* eslint-disable node/no-unpublished-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')
const { IgnorePlugin } = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

const { NODE_ENV } = process.env

module.exports = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  module: {
    rules: [
      {
        include: resolve(__dirname, 'src'),
        test: /\.(graphql|sql)$/,
        type: 'asset/source',
      },
      {
        include: resolve(__dirname, 'src'),
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  output: {
    clean: true,
    filename: 'index.js',
    path: resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          keep_classnames: /AbortSignal/,
          keep_fnames: /AbortSignal/,
        },
      }),
    ],
  },
  plugins: [new IgnorePlugin({ resourceRegExp: /^pg-native$/ })],
  resolve: {
    extensions: ['.ts', '.mjs', '.js'],
  },
  target: 'node16',
  watch: NODE_ENV === 'development',
  watchOptions: {
    ignored: '!src',
  },
}
