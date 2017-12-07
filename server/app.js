/* eslint-disable */
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
import { getFarceResult } from 'found/lib/server';
import createRender from 'found/lib/createRender';
import makeRouteConfig from 'found/lib/makeRouteConfig';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import routes from '../src/routes';

var babelrc = fs.readFileSync(path.resolve(__dirname, '..', '.babelrc'));
var config;

try {
  config = JSON.parse(babelrc);
  config.ignore = /\/(build|node_modules)\//;
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

require('babel-register')(config);

const app = express();

// Support Gzip
app.use(compression());

// Support post requests with body data (doesn't support multipart, use multer)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup logger
const logger = morgan('combined');
app.use(logger);

// Serve static assets
app.use('/static', express.static(path.resolve(__dirname, '..', 'build', 'static')));
app.use('/favicon.ico', express.static(path.resolve(__dirname, '..', 'build', 'favicon.ico')));
app.use('/manifest.json', express.static(path.resolve(__dirname, '..', 'build', 'manifest.json')));

app.use('/', async (req, res) => {
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html');
  const { redirect, status, element } = await getFarceResult({
    url: req.url,
    routeConfig: makeRouteConfig(routes),
    render: createRender({
      renderError: ({ error }) => ( // eslint-disable-line react/prop-types
        <div>
          {error.status === 404 ? 'Not found' : 'Error'}
        </div>
      ),
    }),
  });
  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err);
      return res.status(404).end();
    }
    if (redirect) {
      res.redirect(302, redirect.url);
      return;
    }

    const RenderedApp = htmlData.replace(
      '<div id="root"></div>',
      `<div id="root">${ReactDOMServer.renderToString(element)}</div>`,
    );
    res.status(status).send(RenderedApp);
  });
});

module.exports = app;

/* eslint-enable */
