/* eslint-disable */
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Actions as FarceActions, ServerProtocol } from 'farce';
import { getStoreRenderArgs, resolver, RedirectException } from 'found';
import { RouterProvider } from 'found/lib/server';
import createRender from 'found/lib/createRender';
import serialize from 'serialize-javascript';
import { Provider } from 'react-redux';

import createReduxStore from 'redux/createReduxStore';

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

const render = createRender({
  renderError: ({ error }) => ( // eslint-disable-line react/prop-types
    <div>
      {error.status === 404 ? 'Not found' : 'Error'}
    </div>
  ),
});

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
  const store = createReduxStore(new ServerProtocol(req.url));
  store.dispatch(FarceActions.init());
  const matchContext = { store };
  let renderArgs;
  try {
    renderArgs = await getStoreRenderArgs({
      store,
      matchContext,
      resolver,
    });
  } catch (e) {
    if (e instanceof RedirectException) {
      res.redirect(302, store.farce.createHref(e.location));
      return;
    }

    throw e;
  }
  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err);
      return res.status(404).end();
    }

    const element = <Provider store={store}><RouterProvider router={renderArgs.router}>{render(renderArgs)}</RouterProvider></Provider>;
    const renderedEl = ReactDOMServer.renderToString(element);
    const RenderedApp = htmlData
      .replace(
        '<div id="root"></div>',
        `<div id="root">${renderedEl}</div>`,
      )
      .replace(
        '<script>window.__PRELOADED_STATE__=null</script>',
        `<script>window.__PRELOADED_STATE__=${serialize(store.getState(), { isJSON: true })}</script>`
      );
    res.status(renderArgs.error ? renderArgs.error.status : 200).send(RenderedApp);
  });
});

module.exports = app;

/* eslint-enable */
