import React from 'react';
import ReactDOM from 'react-dom';
import { createProvider as createReduxProvider } from 'react-redux';
import { resolver, getStoreRenderArgs } from 'found/lib';
import { BrowserProtocol, Actions as FarceActions } from 'farce';

import createReduxStore from 'redux/createReduxStore';
import FoundConnectedRouter from 'routes/FoundConnectedRouter';

import './index.scss';

// eslint-disable-next-line
const store = createReduxStore(new BrowserProtocol(), window.__PRELOADED_STATE__);
const matchContext = { store };
store.dispatch(FarceActions.init());

const ReduxProvider = createReduxProvider();

(async () => {
  const initialRenderArgs = await getStoreRenderArgs({
    store,
    matchContext,
    resolver,
  });
  ReactDOM.render(
    <ReduxProvider store={store}>
      <FoundConnectedRouter
        matchContext={matchContext}
        resolver={resolver}
        initialRenderArgs={initialRenderArgs}
      />
    </ReduxProvider>,
    document.getElementById('root'),
  );
})();
