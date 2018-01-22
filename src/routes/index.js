// @flow

import React from 'react';
// import { Route, RedirectException } from 'found';
import { Route } from 'found';
import { graphql } from 'react-relay';
// import { find, pathEq, pathOr } from 'ramda';

import { App } from 'components/App';
import { Login } from 'components/Login';
import { Registration } from 'components/Registration';
import { Profile } from 'components/Profile';

const routes = (
  <Route
    path="/"
    Component={App}
    render={({ props, Component }) => <Component apiVersion={null} {...props} />}
    query={graphql`
        query routes_App_Query {
          ...App_apiVersion
        }
      `}
  >
    <Route
      path="/fb"
      Component={({ location: { query: { code } } }) => <div>{JSON.stringify(code)}</div>}
    />
    <Route
      path="/registration"
      Component={Registration}
    />
    <Route
      path="/login"
      Component={Login}
    />
    <Route
      path="/profile"
      Component={Profile}
    />
  </Route>
);

/*
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
*/

export default routes;
