import React from 'react';
import ReactDOM from 'react-dom';
// import { createProvider as createReduxProvider } from 'react-redux';
import {
  createInitialFarceRouter,
  makeRouteConfig,
  createRender,
} from 'found/lib';
import { BrowserProtocol, queryMiddleware } from 'farce/lib';

// import createReduxStore from 'redux/createReduxStore';
// import FoundConnectedRouter from 'routes/FoundConnectedRouter';
import createResolver from 'relay/createResolver';
import { ClientFetcher } from 'relay/fetcher';
import routes from 'routes';

import './index.scss';

// eslint-disable-next-line
// const store = createReduxStore(new BrowserProtocol(), window.__PRELOADED_STATE__ || {});
// const matchContext = { store };
// store.dispatch(FarceActions.init());
//
// const ReduxProvider = createReduxProvider();

(async () => {
  const fetcher = new ClientFetcher(
    process.env.REACT_APP_GRAPHQL_ENDPOINT,
    window.__RELAY_PAYLOADS__ || [], // eslint-disable-line no-underscore-dangle
  );
  const resolver = createResolver(fetcher);
  const Router = await createInitialFarceRouter({
    historyProtocol: new BrowserProtocol(),
    historyMiddlewares: [queryMiddleware],
    routeConfig: makeRouteConfig(routes),
    resolver,
    render: createRender({}),
  });
  ReactDOM.hydrate(
    <Router resolver={resolver} />,
    document.getElementById('root'),
  );
})();
