// @flow

import React from 'react';
import { createProvider as createReduxProvider } from 'react-redux';
import { getStoreRenderArgs } from 'found/lib';
import { BrowserProtocol } from 'farce';
import createReduxStore from 'redux/createReduxStore';
import FoundConnectedRouter from 'routes/FoundConnectedRouter';
import createResolver from 'relay/createResolver';
import { ClientFetcher } from 'relay/fetcher';

let returnFunc = () => {}; // eslint-disable-line

if (process.env.BROWSER) {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.REACT_APP_RAVEN_CONFIG_URL_SPA
  ) {
    /* eslint-disable */
    // $FlowIgnoreMe
    Raven.config(process.env.REACT_APP_RAVEN_CONFIG_URL_SPA).install();
    /* eslint-enable */
  }

  const store = createReduxStore(
    new BrowserProtocol(),
    window.__PRELOADED_STATE__ || {}, // eslint-disable-line
  );
  const matchContext = { store };

  const ReduxProvider = createReduxProvider();

  const fetcher = new ClientFetcher(
    process.env.REACT_APP_GRAPHQL_ENDPOINT || '',
    window.__RELAY_PAYLOADS__ || [], // eslint-disable-line no-underscore-dangle
  );
  const resolver = createResolver(fetcher);

  returnFunc = () =>
    getStoreRenderArgs({
      store,
      matchContext,
      resolver,
    }).then(initialRenderArgs => (
      // $FlowIgnoreMe
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
