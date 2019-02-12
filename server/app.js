/* eslint-disable */
import { setCookie } from '../src/components/Authorization/utils';

const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const cookiesMiddleware = require('universal-cookie-express');
const Raven = require('raven');
const {
  middleware: graylogMiddleware,
  requestInfoFormatter,
} = require('./graylog-middleware');
const graylogger = require('utils/graylog');

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
import createReduxStore from 'redux/createReduxStore';
import { ServerFetcher } from 'relay/fetcher';
import createResolver from 'relay/createResolver';
import { generateSessionId } from 'utils';
import isTokenExpired from 'utils/token';
import moment from 'moment';

import { Error404, Error } from '../src/pages/Errors';

import { COOKIE_NAME, COOKIE_CURRENCY, COOKIE_FIAT_CURRENCY } from 'constants';

if (process.env.NODE_ENV === 'development') {
  var babelrc = fs.readFileSync(path.resolve(__dirname, '..', '.babelrc'));
  var config;
  try {
    config = JSON.parse(babelrc);
    // Since Babel7 'ignore' MUST be an array
    config.ignore = [/\/(build|node_modules)\//];
  } catch (err) {
    console.error('==>     ERROR: Error parsing your .babelrc.');
    console.error(err);
  }
  require('@babel/register')(config);
}

// clear require() cache if in development mode
// (makes asset hot reloading work)
if (process.env.NODE_ENV !== 'production') {
  webpackIsomorphicTools.refresh();
}

const app = express();

// Support Gzip
app.use(compression());

// Cookies
app.use(cookiesMiddleware());

// Support post requests with body data (doesn't support multipart, use multer)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
  // graylogger
  app.use(graylogMiddleware);
}

// Serve static assets
if (process.env.NODE_ENV === 'production') {
  app.use('/static', express.static('./build/static'));
  if (process.env.REACT_APP_RAVEN_CONFIG_URL_NODE) {
    Raven.config(process.env.REACT_APP_RAVEN_CONFIG_URL_NODE).install();
  }
} else if (process.env.NODE_ENV === 'development') {
  // Setup logger
  const logger = morgan('combined');
  app.use(logger);
}

// healthcheck
app.use('/healthcheck', (req, res) => res.status(200).send());

// logout
app.use('/logout', (req, res) => {
  req.universalCookies.remove('__jwt');
  res.redirect('/');
});

app.use('/favicon.ico', express.static(path.resolve('./build/favicon.ico')));
app.use(
  '/manifest.json',
  express.static(path.resolve('./build/manifest.json')),
);

if (process.env.NODE_ENV === 'development') {
  const webpackConfig = require('../build-utils/webpack.config')({ mode: process.env.NODE_ENV });
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, {
    stats: { colors: true },
  }));
  app.use(webpackHotMiddleware(compiler));
}

const wrapAsync = fn => (req, res, next) => {
  try {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(e => {
      console.error(e);
      if (process.env.NODE_ENV === 'production') {
        const data = requestInfoFormatter(req);
        graylogger.error(data.message, { ...data.payload, error: e });
      }

      res.redirect('/error');
    });
  } catch (e) {
    console.error(e);
    if (process.env.NODE_ENV === 'production') {
      const data = requestInfoFormatter(req);
      graylogger.error(data.message, { ...data.payload, error: e });
    }

    res.redirect('/error');
  }
};

app.use(
  wrapAsync(async (req, res) => {
    if (!req.universalCookies.get(process.env.REACT_APP_COUNTRY_HEADER)) {
      req.universalCookies.set('COUNTRY_IP', req.headers ? req.headers[process.env.REACT_APP_COUNTRY_HEADER] || '' : null, {
        path: '/',
      });
    }
    const expirationDate = new Date();
    req.universalCookies.set(COOKIE_NAME, 'yes');
    // set session_id cookie if not setted :)
    const sessionIdCookie = req.universalCookies.get('SESSION_ID');
    if (!sessionIdCookie) {
      req.universalCookies.set('SESSION_ID', generateSessionId(), {
        path: '/',
      });
    }

    if (process.env.NODE_ENV === 'development') {
      const today = new Date();
      expirationDate.setDate(today.getDate() + 29);
      req.universalCookies.set('holyshit', 'iamcool', {
        path: '/',
        expires: expirationDate,
      });
    }

    const store = createReduxStore(new ServerProtocol(req.url));
    const jwtCookie = req.universalCookies.get('__jwt');
    let jwt = typeof jwtCookie === 'object' && jwtCookie.value;
    if (isTokenExpired(jwt)) {
      req.universalCookies.remove('__jwt');
      jwt = null;
    }

    const url =
      process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_GRAPHQL_ENDPOINT_NODEJS
        : process.env.REACT_APP_GRAPHQL_ENDPOINT;

    const currency = req.universalCookies.get(COOKIE_CURRENCY) || 'STQ';
    const fiatCurrency = req.universalCookies.get(COOKIE_FIAT_CURRENCY) || 'USD';
    const fetcher = new ServerFetcher(
      url,
      req.universalCookies.get('SESSION_ID'),
      currency,
      fiatCurrency,
      req.headers && req.headers['correlation-token'],
      req.universalCookies,
    );

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
        renderPending: () => <div>loading</div>,
        renderError: ({ error }) => {
          if (error.status === 404) {
            return <Error404 />;
          }
          return <Error />;
        },
      })(renderArgs);
      element = (
        <Provider store={store}>
          <RouterProvider router={renderArgs.router}>{rendered}</RouterProvider>
        </Provider>
      );
    } catch (e) {
      element = <div>ERROR :-(</div>;
    }

    if (process.env.NODE_ENV === 'development') {
      const html = ReactDOMServer.renderToString(element);
      const relayPayload = serialize(fetcher, { isJSON: true });
      const preloadedState = serialize(store.getState(), { isJSON: true });
     
      fs.readFile('./build-utils/templates/index.dev.html', 'utf8', (err, htmlData) => {
        const scripts = `
          <script>
            window.__RELAY_PAYLOADS__ = ${relayPayload}
            window.__PRELOADED_STATE__ = ${preloadedState}
          </script>
        `;
        const index = htmlData
          .replace('<!-- ::APP:: -->', html)
          .replace('<!-- ::SCRIPTS:: -->', scripts);
        if (err) {
          console.error('read err', err);
          return res.status(404).end();
        }
        res.send(index);
      });
     
    } else if (process.env.NODE_ENV === 'production') {
      fs.readFile('./build/index.html', 'utf8', (err, htmlData) => {
        if (err) {
          console.error('read err', err);
          return res.status(404).end();
        }

        // add GoogleTagManager for production
        /*
          Copy the following JavaScript and paste it as close to
          the opening <head> tag as possible on every page of your website,
          replacing GTM-XXXX with your container ID:
        */
        const GTMSnippet1 = process.env.REACT_APP_GTM
          ? `<!-- Google Tag Manager -->
          <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${
            process.env.REACT_APP_GTM
          }');</script>
          <!-- End Google Tag Manager -->`
          : '';
        /*
          Copy the following snippet and paste it immediately after the
          opening <body> tag on every page of your website, replacing GTM-XXXX
          with your container ID: 
        */
        const GTMSnippet2 = process.env.REACT_APP_GTM
          ? `
          <!-- Google Tag Manager (noscript) -->
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${
            process.env.REACT_APP_GTM
          }"
          height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
          <!-- End Google Tag Manager (noscript) -->
        `
          : '';

        const RRSnippet = process.env.REACT_APP_RRPARTNERID
          ? `<!-- Retail Rocket -->
          <script type="text/javascript">
            var rrPartnerId = "${process.env.REACT_APP_RRPARTNERID}";
            var rrApi = {};
            var rrApiOnReady = rrApiOnReady || [];
            rrApi.addToBasket = rrApi.order = rrApi.categoryView = rrApi.view =
            rrApi.recomMouseDown = rrApi.recomAddToCart = function() {}; (function(d) {
            var ref = d.getElementsByTagName('script')[0]; var apiJs, apiJsId = 'rrApi-jssdk';
            if (d.getElementById(apiJsId)) return;
            apiJs = d.createElement('script');
            apiJs.id = apiJsId;
            apiJs.async = true;
            apiJs.src = "//cdn.retailrocket.ru/content/javascript/tracking.js"; ref.parentNode.insertBefore(apiJs, ref);
            }(document));
          </script>
          <!-- End Retail Rocket -->`
          : '';

        const CQSnippet = process.env.REACT_APP_CARROT_QUEST_API_KEY
          ? `<script type="text/javascript">
              !function () {
                function t(t, e) {
                  return function () {
                    window.carrotquestasync.push(t, arguments)
                  }
                }
          
                if ('undefined' == typeof carrotquest) {
                  var e = document.createElement('script');
                  e.type = "text/javascript", e.async = !0, e.src = '//cdn.carrotquest.io/api.min.js', document.getElementsByTagName('head')[0].appendChild(e), window.carrotquest = {}, window.carrotquestasync = [], carrotquest.settings = {};
                  for (var n = ['connect', 'track', 'identify', 'auth', 'oth', 'onReady', 'addCallback', 'removeCallback', 'trackMessageInteraction'], a = 0; a < n.length; a++) carrotquest[n[a]] = t(n[a])
                }
              }(), carrotquest.connect('${
                process.env.REACT_APP_CARROT_QUEST_API_KEY
              }');
            </script>`
          : '';

        const renderedEl = ReactDOMServer.renderToString(element);
        const RenderedApp = htmlData
          .replace(
            '<div id="root" style="height:100%;"></div>',
            `<div id="root" style="height:100%;">${renderedEl}</div>`,
          )
          .replace(
            '<script>window.__RELAY_PAYLOADS__=null</script>',
            `<script>window.__RELAY_PAYLOADS__=${serialize(fetcher, {
              isJSON: true,
            })}</script>`,
          )
          .replace(
            '<script>window.__PRELOADED_STATE__=null</script>',
            `<script>window.__PRELOADED_STATE__= ${serialize(store.getState(), {
              isJSON: true,
            })}</script>`,
          )
          .replace('<noscript>GTM_SNIPPET_1</noscript>', GTMSnippet1)
          .replace('<noscript>GTM_SNIPPET_2</noscript>', GTMSnippet2)
          .replace('<noscript>RRSnippet</noscript>', RRSnippet)
          .replace('<noscript>CQSnippet</noscript>', CQSnippet);
        res
          .status(renderArgs.error ? renderArgs.error.status : 200)
          .send(RenderedApp);
      });
    } else {
      return res.status(404).end();
    }
  }),
);

module.exports = app;

/* eslint-enable */
