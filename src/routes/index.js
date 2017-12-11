import React from 'react';
import { Route } from 'found';

import { App } from 'components/App';

const routes = (
  <Route path="/">
    <Route Component={App} />
    <Route path="/info" render={() => <div>Some useful info.</div>} />
    <Route path="/login" render={() => <div>Login here.</div>} />
  </Route>
);

export default routes;
