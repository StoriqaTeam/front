import express from 'express';
import { getFarceResult } from 'found/lib/server';
import ReactDOMServer from 'react-dom/server';
import createRender from 'found/lib/createRender';
import makeRouteConfig from 'found/lib/makeRouteConfig';
import React from 'react';
import Route from 'found/lib/Route';
/* eslint-disable */
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
/* eslint-enable */
import webpackConfig from '../config/webpack.config.dev';

import App from './components/App';

const PORT = 3003;

const app = express();

app.use(webpackMiddleware(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  stats: { colors: true },
}));

app.use(async (req, res) => {
  const { redirect, status, element } = await getFarceResult({
    url: req.url,
    routeConfig: makeRouteConfig((
      <Route path="/">
        <Route Component={App} />
        <Route path="/info" render={() => <div>Some useful info.</div>} />
        <Route path="/login" render={() => <div>Login here.</div>} />
      </Route>
    )),
    render: createRender({
      renderError: ({ error }) => ( // eslint-disable-line react/prop-types
        <div>
          {error.status === 404 ? 'Not found' : 'Error'}
        </div>
      ),
    }),
  });

  if (redirect) {
    res.redirect(302, redirect.url);
    return;
  }

  res.status(status).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Found Universal Example</title>
    </head>
    <body>
    <div id="root">${ReactDOMServer.renderToString(element)}</div>
    <script src="/static/js/bundle.js"></script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`); // eslint-disable-line no-console
});
