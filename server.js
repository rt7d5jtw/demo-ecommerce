const express = require('express');
const webpack = require('webpack');
const cors = require('cors');
const webpackDevMiddleware = require('webpack-dev-middleware');
const compression = require('compression');

/* THIS IS ONLY FOR DEVELOPMENT PURPOSES */

const app = express();
app.use(compression());
app.use(cors());
app.use(express.json());
const config = require('./webpack.config.js');
const compiler = webpack(config({ production: true }));

const host = `localhost` || process.env.HOST;
const port = 8080 || process.env.PORT;

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: compiler.options.output.publicPath,
  })
);

// Serve the files on port 8080.
app.listen(port, function () {
  console.log(`Application at listening at ${host}:${port}!\n`);
});
