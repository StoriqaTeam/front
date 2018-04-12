// @flow

import React from 'react';
import { Route, RedirectException } from 'found';
import { graphql } from 'react-relay';
import Cookies from 'universal-cookie';
import { find, pathEq, pathOr, last } from 'ramda';

import { log, prepareGetUrl } from 'utils';
import { App } from 'components/App';
import { Authorization, OAuthCallback } from 'components/Authorization';
import { Profile } from 'components/Profile';
import Start from 'pages/Start/Start';
import Products from 'pages/Search/Products';
import NewStore from 'pages/Manage/Store/NewStore';
import EditStore from 'pages/Manage/Store/EditStore';
import Contacts from 'pages/Manage/Store/Contacts';
import Stores from 'pages/Stores/Stores';
import { NewProduct, EditProduct } from 'pages/Manage/Store/Product';
import Categories from 'pages/Search/Categories';

const routes = (
  <Route>
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
        mainPage {
          ...Start_mainPage
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
            parentId
            level
            name {
              lang
              text
            }
            children {
              rawId
              parentId
              level
              name {
                lang
                text
              }
              children {
                rawId
                parentId
                level
                name {
                  lang
                  text
                }
                getAttributes {
                  id
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
        path="/categories"
        Component={({ search }) => (<Categories search={search} />)}
        query={graphql`
          query routes_Categories_Query($searchTerm: SearchProductWithoutCategoryInput!) {
            search {
              ...Categories_search @arguments(text: $searchTerm)
            }
          }
        `}
        prepareVariables={(...args) => {
          const queryObj = pathOr('', ['query'], last(args).location);
          const searchTerm = prepareGetUrl(queryObj);
          return ({ searchTerm });
        }}
      />
      <Route
        path="/products"
        Component={({ search }) => (<Products search={search} />)}
        query={graphql`
          query routes_Products_Query($searchTerm: SearchProductInsideCategoryInput!) {
            search {
              ...Products_search @arguments(text: $searchTerm)
            }
          }
        `}
        prepareVariables={(...args) => {
          // http://localhost:3003/products?search=test&category=13&minValue=0&maxValue=1287.4&attrFilters=equal3=blue;equal1=1,50
          const queryObj = pathOr('', ['query'], last(args).location);
          console.log('^^^^ products search queryObj: ', queryObj);
          const searchTerm = prepareGetUrl(queryObj);
          console.log('^^^^ products search searchTerms: ', searchTerm);
          if (!searchTerm.categoryId) {
            searchTerm.categoryId = 1;
          }
          // searchTerm.attrFilters = [];
          console.log('^^^^ products search searchTerms: ', searchTerm);
          return ({ searchTerm });
        }}
      />
      <Route
        path="/stores"
        Component={Stores}
        query={graphql`
        query routes_Stores_Query($input: SearchStoreInput!) {
          search {
            ...Stores_search @arguments(text: $input)
          }
        }
      `}
        prepareVariables={(...args) => {
          const searchValue = pathOr('', ['query', 'search'], last(args).location);
          return ({ input: { name: searchValue, getStoresTotalCount: true } });
        }}
      />
      <Route
        path="/manage"
        render={({ match }) => {
          if (match.context.jwt) {
            return null;
          }
          throw new RedirectException('/login');
        }}
      >
        <Route path="/store">
          <Route
            path="/new"
            exact
            Component={NewStore}
          />
          <Route
            path="/:storeId"
            Component={EditStore}
            query={graphql`
            query routes_Store_Query($storeID: Int!) {
              me {
                ...EditStore_me @arguments(storeId: $storeID)
              }
            }
          `}
            prepareVariables={(_, { params }) => (
              { storeID: parseInt(params.storeId, 10) }
            )}
          />
          <Route
            path="/:storeId/contacts"
            Component={Contacts}
            query={graphql`
            query routes_Contacts_Query($storeID: Int!) {
              me {
              id
              rawId
                ...Contacts_me @arguments(storeId: $storeID)
              }
            }
          `}
            prepareVariables={(_, { params }) => (
              { storeID: parseInt(params.storeId, 10) }
            )}
          />
          <Route
            path="/:storeId/product/new"
            Component={({ params }) => (<NewProduct storeId={params.storeId} />)}
          />
          <Route
            path="/:storeId/products/:productId"
            Component={EditProduct}
            query={graphql`
            query routes_Product_Query($productID: Int!) {
              me {
                id
                ...EditProduct_me @arguments(productId: $productID)
              }
            }
          `}
            prepareVariables={(_, { params }) => ({ productID: parseInt(params.productId, 10) })}
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
          return <Component isSignUp alone {...props} />;
        }}
      />
      <Route
        path="/login"
        Component={Authorization}
        render={({ Component, props }) => (
          <Component alone {...props} />
        )}
      />
      <Route
        path="/logout"
        Component={() => null}
        render={() => {
          const cookies = new Cookies();
          cookies.remove('__jwt');
          window.location = '/';
          return null;
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
  </Route>
);

export default routes;
