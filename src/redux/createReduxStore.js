import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createHistoryEnhancer, queryMiddleware } from 'farce/lib';
import {
  createMatchEnhancer,
  Matcher,
  makeRouteConfig,
  hotRouteConfig,
} from 'found/lib';

import routes from 'routes';
import createReducers from 'redux/reducers/createReducers';

const generateStore = (historyProtocol, initialState) => {
  const middlewares = [thunk];
  const routesConfig = hotRouteConfig(makeRouteConfig(routes));
  if (process.env.NODE_ENV !== 'production') {
    const logger = createLogger({ collapsed: true });
    middlewares.push(logger);
  }
  let composedEnhancers = compose(
    createHistoryEnhancer({
      protocol: historyProtocol,
      middlewares: [queryMiddleware],
    }),
    createMatchEnhancer(new Matcher(routesConfig)),
    applyMiddleware(...middlewares),
  );
  // eslint-disable-next-line
  if (process.browser && window.__REDUX_DEVTOOLS_EXTENSION__) {
    composedEnhancers = compose(
      composedEnhancers,
      // eslint-disable-next-line
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    );
  }

  const reducers = createReducers();
  const store = createStore(
    reducers,
    initialState,
    // eslint-disable-next-line
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    composedEnhancers,
  );
  return store;
};

export default generateStore;
