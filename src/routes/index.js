// @flow

import React from 'react';
import { Route, RedirectException, Redirect } from 'found';
import { graphql } from 'react-relay';
import Cookies from 'universal-cookie';
import { find, pathEq, pathOr, last } from 'ramda';

import { log } from 'utils';
import { urlToInput } from 'utils/search';
import { App } from 'components/App';
import { Authorization, OAuthCallback } from 'components/Authorization';
import { Profile } from 'pages/Profile';
import Start from 'pages/Start/Start';
import { NewStore, EditStore } from 'pages/Manage/Store/Settings';
import { Products } from 'pages/Manage/Store/Products';
import { Contacts } from 'pages/Manage/Store/Contacts';
import { Wizard } from 'pages/Manage/Wizard';
import Stores from 'pages/Stores/Stores';
import { NewProduct, EditProduct } from 'pages/Manage/Store/Products/Product';
import { Product as ProductCard } from 'pages/Store/Product';
import Categories from 'pages/Search/Categories';
import Cart from 'pages/Cart';
import Checkout from 'pages/Checkout';
import { Error } from 'pages/Errors';
import VerifyEmail from 'pages/VerifyEmail';
import Logout from 'pages/Logout';

const routes = (
  <Route>
    <Route path="/error" Component={Error} />
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
          cart {
            id
            totalCount
            ...Cart_cart
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
                      text
                    }
                    metaField {
                      values
                      translatedValues {
                        translations {
                          text
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `}
      render={args => {
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
        path="/cart"
        render={({ props, Component }) => <Component {...props} />}
        Component={Cart}
      />

      <Route
        path="/checkout"
        Component={Checkout}
        query={graphql`
          query routes_Checkout_Query {
            me {
              ...Checkout_me
            }
            cart {
              ...Checkout_cart
            }
          }
        `}
      />

      <Route
        path="/categories"
        Component={Categories}
        query={graphql`
          query routes_Categories_Query($searchTerm: SearchProductInput!) {
            search {
              ...Categories_search @arguments(text: $searchTerm)
            }
          }
        `}
        prepareVariables={(...args) => {
          const queryObj = pathOr('', ['query'], last(args).location);
          const searchTerm = urlToInput(queryObj);
          return { searchTerm };
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
          const queryObj = pathOr('', ['query'], last(args).location);
          const searchTerm = urlToInput(queryObj);
          return { input: { ...searchTerm, getStoresTotalCount: true } };
        }}
      />
      <Route path="/store">
        <Route
          path="/:storeId/products/:productId"
          Component={ProductCard}
          query={graphql`
            query routes_ProductCard_Query($productID: Int!) {
              baseProduct(id: $productID) {
                ...Product_baseProduct
              }
            }
          `}
          prepareVariables={(_, { params }) => ({
            productID: parseInt(params.productId, 10),
          })}
        />
      </Route>
      {/* TODO: вынести в HOC ли придумать что-то */}
      <Route
        path="/manage"
        query={graphql`
          query routes_Manage_Query {
            me {
              id
            }
          }
        `}
        render={({ props }) => {
          if (props && !props.me) {
            const {
              location: { pathname },
            } = props;
            const cookies = new Cookies();
            cookies.remove('__jwt');
            throw new RedirectException(`/login?from=${pathname}`);
          }
        }}
        Component={() => <div />}
      >
        <Route
          path="/wizard"
          Component={Wizard}
          query={graphql`
            query routes_Wizard_Query {
              languages {
                isoCode
              }
              me {
                ...Wizard_me
              }
            }
          `}
        />
        <Route path="/store">
          <Route path="/new" exact Component={NewStore} />
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
            prepareVariables={(_, { params }) => ({
              storeID: parseInt(params.storeId, 10),
            })}
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
            prepareVariables={(_, { params }) => ({
              storeID: parseInt(params.storeId, 10),
            })}
          />
          <Route
            path="/:storeId/product/new"
            Component={({ me }) => <NewProduct me={me} />}
            query={graphql`
              query routes_NewProduct_Query($storeID: Int!) {
                me {
                  ...NewProduct_me @arguments(storeId: $storeID)
                }
              }
            `}
            prepareVariables={(_, { params }) => ({
              storeID: parseInt(params.storeId, 10) || 0,
            })}
          />

          <Route
            path="/:storeId/products"
            Component={Products}
            query={graphql`
              query routes_Products_Query($storeId: Int!) {
                me {
                  ...Products_me @arguments(storeId: $storeId)
                }
              }
            `}
            prepareVariables={(_, { params }) => ({
              storeId: parseInt(params.storeId, 10) || 0,
            })}
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
            prepareVariables={(_, { params }) => ({
              productID: parseInt(params.productId, 10) || 0,
            })}
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
        render={({ Component, props }) => <Component alone {...props} />}
      />
      <Route path="/logout" Component={Logout} />
      <Route
        path="/oauth_callback/fb"
        Component={OAuthCallback}
        render={({ props, Component }) => (
          <Component provider="FACEBOOK" {...props} />
        )}
      />
      <Route
        path="/oauth_callback/google"
        Component={OAuthCallback}
        render={({ props, Component }) => (
          <Component provider="GOOGLE" {...props} />
        )}
      />
      <Route path="/verify_email/:token" Component={VerifyEmail} />
      <Redirect from="/profile" to={() => '/profile/personal-data'} />
      <Route
        path="/profile/orders/:orderId"
        Component={props => <Profile activeItem="order" me={props.me} />}
      />
      <Route
        path="/profile/:item"
        Component={props => (
          <Profile
            activeItem={pathOr('personal-data', ['params', 'item'], props)}
            me={props.me}
          />
        )}
      />
    </Route>
  </Route>
);

export default routes;
