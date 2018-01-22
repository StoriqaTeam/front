// @flow

import React from 'react';
import { Route } from 'found';
import { graphql } from 'react-relay';

import { App } from 'components/App';
import { Login } from 'components/Login';
import { Registration } from 'components/Registration';
import { Profile } from 'components/Profile';

const routes = (
  <Route
    path="/"
    Component={App}
    query={graphql`
      query routes_App_Query {
        ...App_apiVersion
      }
    `}
    render={({ Component, props, error }) => {
      if (error) {
        // eslint-disable-next-line
        console.error(error);
      }
      return <Component {...props} />;
    }}
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

export default routes;
