// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { createProvider as createReduxProvider } from 'react-redux';
import { getStoreRenderArgs } from 'found/lib';
import { BrowserProtocol, Actions as FarceActions } from 'farce';

import createReduxStore from 'redux/createReduxStore';
import FoundConnectedRouter from 'routes/FoundConnectedRouter';
import createResolver from 'relay/createResolver';
import { ClientFetcher } from 'relay/fetcher';

// $FlowIgnore
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
  // $FlowIgnore (see https://github.com/facebook/flow/pull/5074)
  ReactDOM.render(
    <ReduxProvider store={store}>
      <FoundConnectedRouter
        matchContext={matchContext}
        resolver={resolver}
        initialRenderArgs={initialRenderArgs}
      />
    </ReduxProvider>,
    // $FlowIgnore
    document.getElementById('root'),
  );
});

