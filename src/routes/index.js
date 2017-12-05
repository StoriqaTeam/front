import React from 'react';
import { createBrowserRouter, makeRouteConfig, Route } from 'found';

import App from '../components/App';

const AppRouter = createBrowserRouter({
  routeConfig: makeRouteConfig((
    <Route path="/">
      <Route Component={App} />
      <Route path="/info" render={() => <div>Some useful info.</div>} />
    </Route>
  )),
});

export default AppRouter;
