/** @format */

/* eslint-disable global-require, func-names, import/no-dynamic-require, no-param-reassign */

const path = require('path');

/* Webpack Plugins */
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const paths = require('./paths');

/* Plugins Configuration */
const PostCSSConfig = require(path.join(paths.appConfig, 'postcss.config.js'));
const CssMinimizerConfig = require(path.join(paths.appConfig, 'cssminimizer.config.js'));
const TerserConfig = require(path.join(paths.appConfig, 'terser.config.js'));
const BabelConfig = require(path.join(paths.appConfig, 'babel.config.js'));

const isProduction =
  process.env.NODE_ENV !== 'development' && process.env.NODE_ENV === 'production';
const babelConfigs = BabelConfig(isProduction);

function styleLoaders(...additionalLoaders) {
  const loaders = isProduction
    ? [
        {
          loader: MiniCssExtractPlugin.loader,
          options: paths.publicUrl.startsWith('.') ? {publicPath: '../../'} : {},
        },
      ]
    : ['style-loader'];

  loaders.push(
    {
      loader: 'css-loader',
      options: {
        sourceMap: !isProduction,
        importLoaders: 1 + additionalLoaders.length,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: !isProduction,
        postcssOptions: PostCSSConfig,
      },
    },
  );

  loaders.push(...additionalLoaders);

  return loaders;
}

module.exports = {
  mode: isProduction ? 'production' : 'development',
  bail: isProduction,
  devtool: isProduction ? false : 'cheap-module-source-map',
  entry: paths.appIndexJs,
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin(TerserConfig(isProduction)),
      new CssMinimizerPlugin(CssMinimizerConfig(isProduction)),
    ],
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
  },
  output: {
    path: paths.appBuild,
    pathinfo: !isProduction,
    filename: isProduction ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js',
    chunkFilename: isProduction
      ? 'static/js/[name].[contenthash:8].chunk.js'
      : 'static/js/[name].chunk.js',
    publicPath: paths.publicUrl,
  },
  module: {
    strictExportPresence: true,
    rules: [
      {parser: {requireEnsure: false}},
      {
        test: /\.(bmp|gif|png|jpe?g)$/,
        loader: 'url-loader',
        options: {
          limit: '10000',
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(js|mjs|jsx)$/,
        include: paths.appSrc,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          compact: isProduction,
          sourceMaps: !isProduction,
          inputSourceMap: !isProduction,
          ...babelConfigs.source,
        },
      },
      {
        test: /\.(js|mjs)$/,
        exclude: [/@babel(?:\/|\\{1,2})runtime/, paths.appSrc],
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: false,
          compact: false,
          cacheDirectory: true,
          cacheCompression: false,
          sourceMaps: !isProduction,
          inputSourceMap: !isProduction,
          ...babelConfigs.dependency,
        },
      },
      {
        test: /\.css$/,
        use: styleLoaders(),
      },
      {
        test: /\.(scss|sass)$/,
        use: styleLoaders(
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: !isProduction,
              root: paths.appSrc,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction,
            },
          },
        ),
      },
      {
        loader: 'file-loader',
        exclude: [
          /\.(bmp|gif|png|jpe?g)$/,
          /\.(js|mjs|jsx)$/,
          /\.(css|scss|sass)$/,
          /\.html$/,
          /\.json$/,
        ],
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    isProduction && new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      publicPath: paths.publicUrl,
      ...(isProduction
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
        : {}),
    }),
    !isProduction && new webpack.HotModuleReplacementPlugin(),
    isProduction &&
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: paths.publicUrl,
      generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          manifest[file.name] = file.path;
          return manifest;
        }, seed);
        const entrypointFiles = entrypoints.main.filter(fileName => !fileName.endsWith('.map'));

        return {
          files: manifestFiles,
          entrypoints: entrypointFiles,
        };
      },
    }),
    new ESLintPlugin({
      extensions: ['js', 'mjs', 'jsx'],
      context: paths.appSrc,
      cache: true,
      cwd: paths.appPath,
      resolvePluginsRelativeTo: __dirname,
    }),
  ].filter(Boolean),
  resolve: {
    modules: ['node_modules', paths.appNodeModules],
    extensions: ['.web.mjs', '.mjs', '.web.js', '.js', '.jsx', '.json', '.web.jsx'],
    alias: {
      '@': paths.appSrc,
    },
  },
  stats: {children: false},
  performance: false,
  devServer: {
    disableHostCheck: true,
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.appPublic,
    contentBasePublicPath: paths.publicUrl,
    watchContentBase: true,
    hot: true,
    transportMode: 'ws',
    publicPath: paths.publicUrl.slice(0, -1),
    quiet: true,
    watchOptions: {
      ignored: ['node_modules/**'],
    },
    host: '0.0.0.0',
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
      index: paths.publicUrl,
    },
  },
};
