const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config({ path: '../.env' });

module.exports = (env) => {
  const developmentConfig = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
      static: './dist',
      hot: true,
      port: process.env.port,
      open: true,
      historyApiFallback: true,
    },
    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };
  const productionConfig = {
    mode: 'production',
    entry: {
      index: path.resolve(__dirname, './src/index.tsx'),
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].[contenthash].bundle.js',
      chunkFilename: (pathData) => {
        return pathData.chunk.name === 'main' ? '[name].js' : '[name]/[name].js';
      },
      clean: true,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff(2)?|eot|tff|otf|svg|)$/,
          type: 'asset/inline',
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /.s?css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './public/index.html'),
        filename: 'index.html',
        favicon: path.resolve(__dirname, './src/assets/chocolate-bar.png'),
        cache: true,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
    optimization: {
      //minimizer: [new CssMinimizerPlugin()],
    },
    stats: {
      env: true,
    },
  };
  return env.production ? productionConfig : { ...productionConfig, ...developmentConfig };
};
