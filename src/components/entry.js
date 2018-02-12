// @flow

import React from 'react';
import { createProvider as createReduxProvider } from 'react-redux';
import { getStoreRenderArgs } from 'found/lib';
import { BrowserProtocol } from 'farce';

import createReduxStore from 'redux/createReduxStore';
import FoundConnectedRouter from 'routes/FoundConnectedRouter';
import createResolver from 'relay/createResolver';
import { ClientFetcher } from 'relay/fetcher';

import '../index.scss';

// eslint-disable-next-line
const store = createReduxStore(new BrowserProtocol(), window.__PRELOADED_STATE__ || {});
const matchContext = { store };

const ReduxProvider = createReduxProvider();

const fetcher = new ClientFetcher(
  process.env.REACT_APP_GRAPHQL_ENDPOINT,
  window.__RELAY_PAYLOADS__ || [], // eslint-disable-line no-underscore-dangle
);
const resolver = createResolver(fetcher);

export default () => getStoreRenderArgs({
  store,
  matchContext,
  resolver,
}).then(initialRenderArgs => (
  <ReduxProvider store={store}>
    <FoundConnectedRouter
      matchContext={matchContext}
      resolver={resolver}
      initialRenderArgs={initialRenderArgs}
    />
  </ReduxProvider>
));
