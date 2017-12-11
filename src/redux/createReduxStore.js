import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { createHistoryEnhancer, queryMiddleware } from 'farce/lib';
import { createMatchEnhancer, Matcher, makeRouteConfig } from 'found/lib';

import routes from 'routes';
import createReducers from 'redux/reducers/createReducers';

// eslint-disable-next-line
const makeReducersHotReloadable = (store) => {
  if (!module.hot || typeof module.hot.accept !== 'function') return;

  // Webpack for some reason needs an explicit path.
  module.hot.accept('./reducers/createReducers', () => {
    // eslint-disable-next-line global-require
    const reducers = require('./reducers/createReducers').default;
    store.replaceReducer(reducers());
  });
};

const generateStore = (historyProtocol) => {
  const composedEnhancers = compose(
    createHistoryEnhancer({
      protocol: historyProtocol,
      middlewares: [queryMiddleware],
    }),
    createMatchEnhancer(new Matcher(makeRouteConfig(routes))),
    applyMiddleware(thunk),
    applyMiddleware(logger),
  );

  const reducers = createReducers();
  const store = createStore(
    reducers,
    // eslint-disable-next-line
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    composedEnhancers,
  );
  makeReducersHotReloadable(store);
  return store;
};

export default generateStore;
