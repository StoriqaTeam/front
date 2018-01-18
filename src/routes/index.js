// @flow

import React from 'react';
import { Route, RedirectException } from 'found';
import { graphql } from 'react-relay';
import { find, pathEq, pathOr } from 'ramda';

import { App } from 'components/App';
import { Login } from 'components/Login';
import { Registration } from 'components/Registration';

const routes = (
  <Route>
    <Route
      path="/"
      Component={App}
      query={graphql`
        query routes_App_Query {
          viewer {
            ...App_currentUser
          }
        }
      `}
      render={({ Component, error, props }) => {
        if (error) {
          const errors = pathOr(null, ['source', 'errors'], error);
          if (find(pathEq(['data', 'details', 'code'], '401'))(errors)) {
            throw new RedirectException('/login');
          }
          return null;
        }
        return <Component {...props} />;
      }}
    />
    <Route
      path="/registration"
      Component={Registration}
    />
    <Route
      path="/login"
      Component={Login}
    />
  </Route>
);

export default routes;
