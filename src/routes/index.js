// @flow

import React from 'react';
import { Route, RedirectException } from 'found';
import { graphql } from 'react-relay';
import Cookies from 'universal-cookie';
import { find, pathEq, pathOr } from 'ramda';

import PrivateRoute from 'routes/PrivateRoute';
import { log } from 'utils';
import { App } from 'components/App';
import { Authorization, OAuthCallback } from 'components/Authorization';
import { Profile } from 'components/Profile';
import EditStore from 'pages/Manage/Store/EditStore';
import Contacts from 'pages/Manage/Store/Contacts';

const routes = (
  <Route
    path="/"
    Component={App}
    query={graphql`
      query routes_App_Query {
        id
        me {
          id
          ...App_me
        }
        languages {
          key
          name
        }
        currencies {
          key
          name
        }
      }
    `}
    render={({ Component, props, error }) => {
      if (error) {
        log.error({ error });
        const errors = pathOr([], ['source', 'errors'], error);
        if (find(pathEq(['data', 'details', 'code'], '401'))(errors)) {
          return <Component {...props} />;
        }
      }
      return <Component {...props} />;
    }}
  >
    <Route Component={() => <div />} />

    <Route
      path="/manage"
      Component={PrivateRoute}
    >
      <Route path="/store">
        <Route
          path="/new"
          Component={EditStore}
        />
        <Route
          path=":storeId/contacts"
          Component={Contacts}
        />
      </Route>
    </Route>

    <Route
      path="/registration"
      Component={Authorization}
      render={({ Component, props, error }) => {
        if (error) {
          const errors = pathOr(null, ['source', 'errors'], error);
          if (find(pathEq(['data', 'details', 'code'], '401'))(errors)) {
            return <Component isSignUp {...props} />;
          }
        }
        return <Component isSignUp {...props} />;
      }}
    />
    <Route
      path="/login"
      Component={Authorization}
    />
    <Route
      path="/logout"
      Component={null}
      render={() => {
        const cookies = new Cookies();
        cookies.remove('__jwt');
        throw new RedirectException('/');
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
