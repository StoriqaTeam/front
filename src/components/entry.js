// @flow

import React from 'react';
import { createProvider as createReduxProvider } from 'react-redux';
import { getStoreRenderArgs } from 'found/lib';
import { BrowserProtocol } from 'farce';
import Cookies from 'universal-cookie';
import { pathOr } from 'ramda';
import createReduxStore from 'redux/createReduxStore';
import FoundConnectedRouter from 'routes/FoundConnectedRouter';
import createResolver from 'relay/createResolver';
import { ClientFetcher } from 'relay/fetcher';

import '../index.scss';

const cookies = new Cookies();
const jwt = pathOr(null, ['value'], cookies.get('__jwt'));

let returnFunc = () => {}; // eslint-disable-line

if (process.env.BROWSER) {
  // eslint-disable-next-line
  const store = createReduxStore(new BrowserProtocol(), window.__PRELOADED_STATE__ || {});
  const matchContext = { store, jwt };

  const ReduxProvider = createReduxProvider();

  const fetcher = new ClientFetcher(
    process.env.REACT_APP_GRAPHQL_ENDPOINT,
    window.__RELAY_PAYLOADS__ || [], // eslint-disable-line no-underscore-dangle
  );
  const resolver = createResolver(fetcher);

  returnFunc = () => getStoreRenderArgs({
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
}

export default returnFunc;
