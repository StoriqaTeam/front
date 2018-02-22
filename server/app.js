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
import serialize from '../libs/serialize-javascript';
import { Provider } from 'react-redux';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
const cookiesMiddleware = require('universal-cookie-express');

import webpackConfig from '../config/webpack.config.dev';

import createReduxStore from 'redux/createReduxStore';
import { ServerFetcher } from 'relay/fetcher';
import createResolver from 'relay/createResolver';

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

// Cookies
app.use(cookiesMiddleware());

// Support post requests with body data (doesn't support multipart, use multer)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static assets
if (process.env.NODE_ENV === 'production') {
  app.use('/static', express.static(path.resolve(__dirname, '..', 'build', 'static')));
} else if (process.env.NODE_ENV === 'development') {
  // Setup logger
  const logger = morgan('combined');
  app.use(logger);
}

app.use('/favicon.ico', express.static(path.resolve(__dirname, '..', 'build', 'favicon.ico')));
app.use('/manifest.json', express.static(path.resolve(__dirname, '..', 'build', 'manifest.json')));

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, {stats: {colors: true}}));
  app.use(webpackHotMiddleware(compiler));
}

app.use(async (req, res) => {
  const store = createReduxStore(new ServerProtocol(req.url));
  const jwtCookie = req.universalCookies.get('__jwt');
  const jwt = (typeof jwtCookie === 'object') && jwtCookie.value;
  const fetcher = new ServerFetcher(process.env.REACT_APP_SERVER_GRAPHQL_ENDPOINT, jwt);

  store.dispatch(FarceActions.init());

  const matchContext = { store };

  let renderArgs;
  try {
    renderArgs = await getStoreRenderArgs({
      store,
      matchContext,
      resolver: createResolver(fetcher),
    });
  } catch (e) {
    if (e instanceof RedirectException) {
      res.redirect(302, store.farce.createHref(e.location));
      return;
    }
    throw e;
  }
  const element = (
    <Provider store={store}>
      <RouterProvider router={renderArgs.router}>
        {createRender(renderArgs)}
      </RouterProvider>
    </Provider>
  );
  if (process.env.NODE_ENV === 'development') {
    res.status(renderArgs.error ? renderArgs.error.status : 200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link rel="stylesheet" type="text/css" href="/styles.css">
      </head>
      <body>
      <div id="root" style="height: 100%">${ReactDOMServer.renderToString(element)}</div>
      <script>
        window.__RELAY_PAYLOADS__ = ${serialize(fetcher, { isJSON: true })};
        window.__PRELOADED_STATE__= ${serialize(store.getState(), { isJSON: true })}
      </script>
      <script src="/static/js/bundle.js"></script>
      </body>  
      </html>
    `);
  } else if (process.env.NODE_ENV === 'production') {
    const filePath = path.resolve(__dirname, '..', 'build', 'index.html');
    fs.readFile(filePath, 'utf8', (err, htmlData) => {
      if (err) {
        console.error('read err', err);
        return res.status(404).end();
      }

      const renderedEl = ReactDOMServer.renderToString(element);
      const RenderedApp = htmlData
        .replace(
          '<div id="root" style="height: 100%"></div>',
          `<div id="root" style="height: 100%">${renderedEl}</div>`,
        )
        .replace(
          '<script>window.__RELAY_PAYLOADS__=null</script>',
          `<script>window.__RELAY_PAYLOADS__=${serialize(fetcher, { isJSON: true })}</script>`
        )
        .replace(
          '<script>window.__PRELOADED_STATE__=null</script>',
          `<script>window.__PRELOADED_STATE__= ${serialize(store.getState(), { isJSON: true })}</script>`
        );
      res.status(renderArgs.error ? renderArgs.error.status : 200).send(RenderedApp);
    });
  } else {
    return res.status(404).end();
  }
});

module.exports = app;

/* eslint-enable */
