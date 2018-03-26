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
import Start from 'pages/Start/Start';
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
          isoCode
        }
        currencies {
          key
          name
        }
        categories {
          name {
            text
          }
          children {
            rawId
            name {
              lang
              text
            }
            children {
              rawId
              name {
                lang
                text
              }
              children {
                rawId
                name {
                  lang
                  text
                }
              }
            }
          }
        }
      }
    `}
    render={(args) => {
      const { error, Component, props } = args;
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
    <Route Component={Start} />

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
          path="/:storeId/contacts"
          Component={Contacts}
          query={graphql`
            query routes_Contacts_Query($storeID: ID!) {
              me {
                ...Contacts_me @arguments(storeId: $storeID)
              }
            }
          `}
          prepareVariables={(_, { params }) => (
            { storeID: params.storeId }
          )}
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
