// @flow

import React from 'react';
import { Route } from 'found';
import { graphql } from 'react-relay';
import Cookies from 'universal-cookie';
import { find, pathEq, pathOr } from 'ramda';

import { App } from 'components/App';
import { Login, OAuthCallback } from 'components/Login';
import { Registration } from 'components/Registration';
import { Profile } from 'components/Profile';

const routes = (
  <Route
    path="/"
    Component={App}
    query={graphql`
      query routes_App_Query {
        ...App_apiVersion
        viewer {
          currentUser {
            id
            email
          }
        }
      }
    `}
    render={({ Component, props, error }) => {
      if (error) {
        const errors = pathOr(null, ['source', 'errors'], error);
        if (find(pathEq(['data', 'details', 'code'], '401'))(errors)) {
          return <Component {...props} apiVersion={null} />;
        }
        return null;
      }
      return <Component {...props} apiVersion={null} />;
    }}
  >
    <Route
      path="/registration"
      Component={Registration}
    />
    <Route
      path="/login"
      Component={Login}
    />
    <Route
      path="/logout"
      Component={null}
      render={() => {
        const cookies = new Cookies();
        cookies.remove('__jwt');
        window.location.href = '/';
      }}
    />
    <Route
      path="/oauth_callback/fb"
      Component={OAuthCallback}
      render={({ props, Component }) => <Component provider="FACEBOOK" {...props} />}
    />
    <Route
      path="/oauth_callback/google"
      Component={OAuthCallback}
      render={({ props, Component }) => <Component provider="GOOGLE" {...props} />}
    />
    <Route
      path="/profile"
      Component={Profile}
    />
  </Route>
);

export default routes;
