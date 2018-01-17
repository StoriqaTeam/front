import React from 'react';
import ReactDOM from 'react-dom';
import { createProvider as createReduxProvider } from 'react-redux';
import { getStoreRenderArgs } from 'found/lib';
import { BrowserProtocol, Actions as FarceActions } from 'farce';

import createReduxStore from 'redux/createReduxStore';
import FoundConnectedRouter from 'routes/FoundConnectedRouter';
import createResolver from 'relay/createResolver';
import { ClientFetcher } from 'relay/fetcher';

import './index.scss';

// eslint-disable-next-line
const store = createReduxStore(new BrowserProtocol(), window.__PRELOADED_STATE__ || {});
const matchContext = { store };
store.dispatch(FarceActions.init());

const ReduxProvider = createReduxProvider();

const fetcher = new ClientFetcher(
  process.env.REACT_APP_GRAPHQL_ENDPOINT,
  window.__RELAY_PAYLOADS__ || [], // eslint-disable-line no-underscore-dangle
);
const resolver = createResolver(fetcher);
getStoreRenderArgs({
  store,
  matchContext,
  resolver,
}).then((initialRenderArgs) => {
  ReactDOM.hydrate(
    <ReduxProvider store={store}>
      <FoundConnectedRouter
        matchContext={matchContext}
        resolver={resolver}
        initialRenderArgs={initialRenderArgs}
      />
    </ReduxProvider>,
    document.getElementById('root'),
  );
});

