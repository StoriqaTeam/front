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

import createReduxStore from 'redux/createReduxStore';
import { ServerFetcher } from 'relay/fetcher';
import createResolver from 'relay/createResolver';

if (process.env.NODE_ENV === 'development') {
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
}

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
  app.use('/static', express.static('./build/static'));
} else if (process.env.NODE_ENV === 'development') {
  // Setup logger
  const logger = morgan('combined');
  app.use(logger);
}

app.use('/favicon.ico', express.static(path.resolve('./build/favicon.ico')));
app.use('/manifest.json', express.static(path.resolve('./build/manifest.json')));

if (process.env.NODE_ENV === 'development') {
  const webpackConfig = require('../config/webpack.config.dev');
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, {stats: {colors: true}}));
  app.use(webpackHotMiddleware(compiler));
}

const wrapAsync = (fn) => (req, res, next) => {
  // Make sure to `.catch()` any errors and pass them along to the `next()`
  // middleware in the chain, in this case the error handler.
  fn(req, res, next).catch(next);
};

app.use(wrapAsync(async (req, res) => {
  const store = createReduxStore(new ServerProtocol(req.url));
  const jwtCookie = req.universalCookies.get('__jwt');
  const jwt = (typeof jwtCookie === 'object') && jwtCookie.value;
  const fetcher = new ServerFetcher(process.env.REACT_APP_SERVER_GRAPHQL_ENDPOINT, jwt);

  store.dispatch(FarceActions.init());

  const matchContext = { store, jwt };

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

  let element;
  try {
    const rendered = createRender({
      renderPending: () => (<div>loading</div>),
      renderError: ({ error }) => (<div>{error.status === 404 ? 'Not found' : 'Error'}</div>),
    })(renderArgs);
    element = (
      <Provider store={store}>
        <RouterProvider router={renderArgs.router}>
          {rendered}
        </RouterProvider>
      </Provider>
    );
  } catch (e) {
    element = (<div>ERROR :-(</div>);
  }

  if (process.env.NODE_ENV === 'development') {
    res.status(renderArgs.error ? renderArgs.error.status : 200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link rel="stylesheet" type="text/css" href="/styles.css">
      </head>
      <body>
      <div id="root" style="height: 100%;">${ReactDOMServer.renderToString(element)}</div>
      <script>
        window.__RELAY_PAYLOADS__ = ${serialize(fetcher, { isJSON: true })};
        window.__PRELOADED_STATE__= ${serialize(store.getState(), { isJSON: true })}
      </script>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDZFEQohOpK4QNELXiXw50DawOyoSgovTs&libraries=places" type="text/javascript"></script>
      <script src="/static/js/bundle.js"></script>
      </body>  
      </html>
    `);
  } else if (process.env.NODE_ENV === 'production') {
    fs.readFile('./build/index.html', 'utf8', (err, htmlData) => {
      if (err) {
        console.error('read err', err);
        return res.status(404).end();
      }

      const renderedEl = ReactDOMServer.renderToString(element);
      const RenderedApp = htmlData
        .replace(
          '<div id="root" style="height:100%"></div>',
          `<div id="root" style="height:100%;">${renderedEl}</div>`,
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
}));

module.exports = app;

/* eslint-enable */
