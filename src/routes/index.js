// @flow

import React from 'react';
import { Route } from 'found';
import { graphql } from 'react-relay';

import { App } from 'components/App';

const routes = (
  <Route>
    <Route
      path="/"
      Component={App}
      query={graphql`
        query routes_App_Query {
          apiVersion
        }
      `}
      render={({ Component, props, error }) => {
        if (error) {
          // eslint-disable-next-line
          console.error(error);
        }
        return <Component {...props} />;
      }}
    />
    <Route
      path="/info"
      render={() => <div>INFO</div>}
    />
    <Route
      path="/login"
      render={() => <div>Login here.</div>}
    />
  </Route>
);

export default routes;
