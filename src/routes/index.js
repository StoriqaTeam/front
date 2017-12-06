import React from 'react';
import { createBrowserRouter, makeRouteConfig, Route } from 'found';

import App from '../components/App';

const createApp = ({ props }) => (
  createBrowserRouter({
    routeConfig: makeRouteConfig((
      <Route initialProps={props} path="/">
        <Route Component={App} />
        <Route path="/info" render={() => <div>Some useful info.</div>} />
        <Route path="/login" render={() => <div>Login here.</div>} />
      </Route>
    )),

    // eslint-disable-next-line react/prop-types
    renderError: ({ error }) => (
      <div>
        {error.status === 404 ? 'Not found' : 'Error'}
      </div>
    ),
  })
);

export default createApp;
